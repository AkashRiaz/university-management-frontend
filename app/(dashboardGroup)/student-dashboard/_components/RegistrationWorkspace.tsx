"use client";

// Performance notes
// - The former single 212-line component kept every piece of state at the top,
//   so choosing a semester, ticking the terms checkbox or any other change
//   re-rendered the WHOLE workspace (all section cards, all selected courses).
// - It is now split into small memoized components. State that only one part
//   needs is colocated in that part (semester choice, terms checkbox, course
//   filter), handlers are stable (useCallback) and derived values are memoized
//   (useMemo), so each interaction re-renders only the part that changed.

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, Search, Trash2, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { IInvoice } from "@/types/invoice.type";
import { ISemester } from "@/types/semester.type";
import { ICourseRegistration, IRegistration } from "@/types/registration.type";
import {
  addCourseRegistrationAction,
  dropCourseRegistrationAction,
  getAvailableCoursesAction,
  getCourseRegistrationsAction,
} from "../_actions/courseRegistrationActions";
import { createRegistrationAction, submitRegistrationAction } from "../_actions/registrationActions";
import { createBkashPaymentAction } from "../_actions/paymentActions";

type AvailableSection = {
  id: string;
  course?: { id: string; code: string; title: string; credit: number } | null;
  capacity?: number;
  enrolledCount?: number;
  room?: { roomNumber?: string | null } | null;
  schedules?: Array<{ dayOfWeek?: string; startTime?: string; endTime?: string }>;
  instructors?: Array<{ instructor?: { user?: { name?: string | null } } }>;
};

type AvailableData = {
  courses: Array<{ course?: { id: string; code: string; title: string; credit: number } }>;
  sections: AvailableSection[];
};

const statusVariant = (status: IRegistration["status"]) =>
  status === "REJECTED" ? "destructive" : status === "APPROVED" ? "secondary" : "outline";

/* ------------------------------------------------------------------ */
/* Semester picker – owns its own selection state                      */
/* ------------------------------------------------------------------ */
const SemesterPicker = memo(function SemesterPicker({
  semesters,
  loading,
  onCreate,
}: {
  semesters: ISemester[];
  loading: boolean;
  onCreate: (semesterId: string) => void;
}) {
  const [semesterId, setSemesterId] = useState(
    () => semesters.find((item) => item.status === "UPCOMING" || item.status === "ACTIVE")?.id || "",
  );

  return (
    <Card>
      <CardHeader><CardTitle>Start a registration</CardTitle><CardDescription>Select the academic semester for your next program semester.</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <select aria-label="Semester" className="h-9 rounded-lg border bg-background px-3 text-sm" value={semesterId} onChange={(event) => setSemesterId(event.target.value)}>
          <option value="">Select semester</option>
          {semesters.map((semester) => <option key={semester.id} value={semester.id}>{semester.name}{semester.academicYear?.name ? ` (${semester.academicYear.name})` : ""}</option>)}
        </select>
        <Button onClick={() => onCreate(semesterId)} disabled={!semesterId || loading}><Plus className="size-4" />Create registration</Button>
      </CardContent>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* Registration switcher                                               */
/* ------------------------------------------------------------------ */
const RegistrationSwitcher = memo(function RegistrationSwitcher({
  registrations,
  activeId,
  onSelect,
}: {
  registrations: IRegistration[];
  activeId?: string;
  onSelect: (registration: IRegistration) => void;
}) {
  if (registrations.length === 0) return null;
  return (
    <Card>
      <CardHeader><CardTitle>Your registrations</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {registrations.map((item) => (
          <Button key={item.id} variant={activeId === item.id ? "default" : "outline"} onClick={() => onSelect(item)}>
            {item.registrationNumber}<Badge variant={statusVariant(item.status)}>{item.status}</Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* Available sections – memoized cards + debounced filter              */
/* ------------------------------------------------------------------ */
const SectionCard = memo(function SectionCard({
  section,
  isAdded,
  loading,
  onAdd,
}: {
  section: AvailableSection;
  isAdded: boolean;
  loading: boolean;
  onAdd: (sectionId: string) => void;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{section.course?.code} - {section.course?.title}</p>
          <p className="text-xs text-muted-foreground">{section.room?.roomNumber || "Room not assigned"} · {section.capacity ? `${section.capacity - (section.enrolledCount || 0)} seats left` : "Capacity unavailable"}</p>
        </div>
        <Button size="sm" onClick={() => onAdd(section.id)} disabled={loading || isAdded}>{isAdded ? "Added" : "Add"}</Button>
      </div>
    </div>
  );
});

const AvailableSections = memo(function AvailableSections({
  sections,
  selectedSectionIds,
  loading,
  onAdd,
}: {
  sections: AvailableSection[];
  selectedSectionIds: Set<string>;
  loading: boolean;
  onAdd: (sectionId: string) => void;
}) {
  // Colocated: typing here re-renders only this list, never the whole workspace.
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const visibleSections = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return sections;
    return sections.filter((section) =>
      `${section.course?.code ?? ""} ${section.course?.title ?? ""} ${section.room?.roomNumber ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [sections, debouncedQuery]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium">Available sections</h3>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by course code or title..." aria-label="Filter available sections" className="h-8 pl-9" />
        </div>
      </div>
      {visibleSections.length === 0 ? (
        <p className="text-sm text-muted-foreground">{sections.length === 0 ? "No sections available." : "No sections match your filter."}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibleSections.map((section) => (
            <SectionCard key={section.id} section={section} isAdded={selectedSectionIds.has(section.id)} loading={loading} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Selected courses                                                    */
/* ------------------------------------------------------------------ */
const SelectedCourses = memo(function SelectedCourses({
  selected,
  canEdit,
  loading,
  onDrop,
}: {
  selected: ICourseRegistration[];
  canEdit: boolean;
  loading: boolean;
  onDrop: (courseRegistrationId: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-medium">Selected courses ({selected.length})</h3>
      {selected.length === 0 ? (
        <p className="text-sm text-muted-foreground">No courses selected yet.</p>
      ) : (
        <div className="space-y-2">
          {selected.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{item.section?.course?.code} - {item.section?.course?.title}</p>
                <p className="text-xs text-muted-foreground">{item.section?.room?.roomNumber || "Room not assigned"} · {item.status}</p>
              </div>
              {canEdit && <Button size="sm" variant="destructive" onClick={() => onDrop(item.id)} disabled={loading}><Trash2 className="size-4" />Drop</Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Payment status                                                      */
/* ------------------------------------------------------------------ */
const PaymentStatus = memo(function PaymentStatus({
  invoice,
  isPaid,
  canPay,
  loading,
  onPay,
}: {
  invoice: IInvoice | null | undefined;
  isPaid: boolean;
  canPay: boolean;
  loading: boolean;
  onPay: () => void;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="font-medium">Payment status</p>
      <p className="text-sm text-muted-foreground">{invoice ? isPaid ? "Paid in full" : `Outstanding balance: ${invoice.dueAmount ?? "unknown"}` : "No invoice found for this semester."}</p>
      {invoice && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span>Total: ৳{invoice.total ?? invoice.totalAmount ?? "unknown"}</span>
          <span>Paid: ৳{invoice.paidAmount ?? 0}</span>
          <span>Due: ৳{invoice.dueAmount ?? "unknown"}</span>
          {canPay && <Button onClick={onPay} disabled={loading}><WalletCards className="size-4" />Pay with bKash</Button>}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Submit panel – owns the terms checkbox                              */
/* ------------------------------------------------------------------ */
const SubmitPanel = memo(function SubmitPanel({
  loading,
  hasCourses,
  isPaid,
  onSubmit,
}: {
  loading: boolean;
  hasCourses: boolean;
  isPaid: boolean;
  onSubmit: (termsAccepted: boolean) => void;
}) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />I confirm that the selected courses and registration details are correct.</label>
      <Button onClick={() => onSubmit(termsAccepted)} disabled={loading || !hasCourses || !termsAccepted || !isPaid}>{loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}Submit registration</Button>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Workspace                                                           */
/* ------------------------------------------------------------------ */
export default function RegistrationWorkspace({
  semesters,
  initialRegistrations,
  invoices,
}: {
  semesters: ISemester[];
  initialRegistrations: IRegistration[];
  invoices: IInvoice[];
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [registration, setRegistration] = useState<IRegistration | null>(
    () => initialRegistrations.find((item) => item.status === "DRAFT") || initialRegistrations[0] || null,
  );
  const [available, setAvailable] = useState<AvailableData | null>(null);
  const [selected, setSelected] = useState<ICourseRegistration[]>(() => registration?.courses || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canEdit = registration?.status === "DRAFT";

  // Derived values are memoized so they keep the same identity between renders
  // and the memoized children that receive them can skip re-rendering.
  const invoice = useMemo(
    () =>
      registration
        ? invoices.find(
            (item) =>
              item.studentId === registration.studentId &&
              item.semesterId === registration.semesterId,
          )
        : null,
    [invoices, registration],
  );
  const isPaid = invoice ? Number(invoice.dueAmount ?? 1) === 0 : false;
  const canPay = Boolean(
    invoice &&
      Number(invoice.dueAmount ?? 0) > 0 &&
      invoice.status !== "PAID" &&
      invoice.status !== "CANCELLED",
  );

  const selectedSectionIds = useMemo(
    () => new Set(selected.map((item) => item.sectionId)),
    [selected],
  );

  const fetchCourses = useCallback(async (id: string) => {
    const [availableResult, selectedResult] = await Promise.all([
      getAvailableCoursesAction(id),
      getCourseRegistrationsAction(id),
    ]);
    if (!availableResult.success) setMessage(availableResult.message);
    else setAvailable((availableResult.data || null) as AvailableData | null);
    if (!selectedResult.success) setMessage(selectedResult.message);
    else setSelected((selectedResult.data || []) as ICourseRegistration[]);
  }, []);

  useEffect(() => {
    if (!registration) return;
    const registrationId = registration.id;
    void (async () => {
      const [availableResult, selectedResult] = await Promise.all([
        getAvailableCoursesAction(registrationId),
        getCourseRegistrationsAction(registrationId),
      ]);
      if (!availableResult.success) setMessage(availableResult.message);
      else setAvailable((availableResult.data || null) as AvailableData | null);
      if (!selectedResult.success) setMessage(selectedResult.message);
      else setSelected((selectedResult.data || []) as ICourseRegistration[]);
    })();
  }, [registration]);

  // Stable handlers (useCallback): memoized children receive the same function
  // reference across renders instead of a new one every time.
  const createRegistration = useCallback(async (semesterId: string) => {
    setLoading(true);
    setMessage("");
    const result = await createRegistrationAction(semesterId);
    if (!result.success) setMessage(result.message);
    else {
      const created = result.data as IRegistration;
      setRegistrations((current) => [created, ...current]);
      setRegistration(created);
    }
    setLoading(false);
  }, []);

  const addCourse = useCallback(async (sectionId: string) => {
    if (!registration) return;
    setLoading(true);
    setMessage("");
    const result = await addCourseRegistrationAction(registration.id, sectionId);
    if (!result.success) setMessage(result.message);
    else await fetchCourses(registration.id);
    setLoading(false);
  }, [registration, fetchCourses]);

  const dropCourse = useCallback(async (courseRegistrationId: string) => {
    if (!registration || !window.confirm("Drop this course from your registration?")) return;
    setLoading(true);
    setMessage("");
    const result = await dropCourseRegistrationAction(courseRegistrationId);
    if (!result.success) setMessage(result.message);
    else await fetchCourses(registration.id);
    setLoading(false);
  }, [registration, fetchCourses]);

  const submit = useCallback(async (termsAccepted: boolean) => {
    if (!registration) return;
    if (!termsAccepted) return setMessage("Please confirm the registration terms.");
    if (!isPaid) return setMessage("Your invoice must be fully paid before submission.");
    setLoading(true);
    setMessage("");
    const result = await submitRegistrationAction(registration.id);
    if (!result.success) setMessage(result.message);
    else setRegistration(result.data as IRegistration);
    setLoading(false);
  }, [registration, isPaid]);

  const payWithBkash = useCallback(async () => {
    if (!invoice || !canPay) return;
    const paymentWindow = window.open("about:blank", "_blank");

    if (!paymentWindow) {
      setMessage("Please allow pop-ups to continue with bKash payment.");
      return;
    }

    paymentWindow.opener = null;
    setLoading(true);
    setMessage("");
    const result = await createBkashPaymentAction(invoice.id);
    if (!result.success) {
      paymentWindow.close();
      setMessage(result.message);
      setLoading(false);
      return;
    }

    const payment = result.data as { paymentURL?: string } | null;
    if (!payment?.paymentURL) {
      paymentWindow.close();
      setMessage("Payment checkout URL was not returned. Please try again.");
      setLoading(false);
      return;
    }

    paymentWindow.location.href = payment.paymentURL;
    setLoading(false);
  }, [invoice, canPay]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Course Registration</h1>
        <p className="text-sm text-muted-foreground">Create, complete, and submit your semester registration.</p>
      </div>
      {message && <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4" />{message}</div>}
      <SemesterPicker semesters={semesters} loading={loading} onCreate={createRegistration} />
      <RegistrationSwitcher registrations={registrations} activeId={registration?.id} onSelect={setRegistration} />
      {registration && <Card>
        <CardHeader><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle>{registration.registrationNumber}</CardTitle><CardDescription>{registration.semester?.name || registration.semesterId} · Program semester {registration.programSemesterNumber}</CardDescription></div><Badge variant={statusVariant(registration.status)}>{registration.status}</Badge></div></CardHeader>
        <CardContent className="flex flex-col gap-5">
          {canEdit && available && <AvailableSections sections={available.sections} selectedSectionIds={selectedSectionIds} loading={loading} onAdd={addCourse} />}
          <SelectedCourses selected={selected} canEdit={canEdit} loading={loading} onDrop={dropCourse} />
          <PaymentStatus invoice={invoice} isPaid={isPaid} canPay={canPay} loading={loading} onPay={payWithBkash} />
          {canEdit && <SubmitPanel key={registration.id} loading={loading} hasCourses={selected.length > 0} isPaid={isPaid} onSubmit={submit} />}
        </CardContent>
      </Card>}
    </div>
  );
}
