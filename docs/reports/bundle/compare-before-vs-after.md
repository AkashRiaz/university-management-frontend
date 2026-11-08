# Bundle comparison: before vs after

First Load JS per route (gzip measured from real build chunks).

| Route | before raw | after raw | before gzip | after gzip | Δ gzip |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Shared by all** | 644.2 KB | 644.2 KB | 201.0 KB | 201.0 KB | +0.0% |
| `/` | 925.1 KB | 924.6 KB | 291.8 KB | 291.6 KB | -0.1% |
| `/_not-found` | 644.2 KB | 644.2 KB | 201.0 KB | 201.0 KB | +0.0% |
| `/about` | 774.9 KB | 774.7 KB | 244.8 KB | 244.5 KB | -0.1% |
| `/academic-calendar` | 779.4 KB | 779.5 KB | 246.5 KB | 246.3 KB | -0.1% |
| `/academics` | 774.9 KB | 774.7 KB | 244.8 KB | 244.5 KB | -0.1% |
| `/admin-dashboard` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/admin-dashboard/academic-years` | 1277.5 KB | 744.8 KB | 361.5 KB | 234.4 KB | -35.2% |
| `/admin-dashboard/class-schedules` | 1331.6 KB | 744.9 KB | 380.5 KB | 234.5 KB | -38.4% |
| `/admin-dashboard/courses` | 1331.5 KB | 744.8 KB | 380.1 KB | 234.5 KB | -38.3% |
| `/admin-dashboard/create-department` | 1246.1 KB | 1235.6 KB | 356.4 KB | 353.7 KB | -0.8% |
| `/admin-dashboard/create-program` | 1245.9 KB | 1234.4 KB | 356.4 KB | 353.4 KB | -0.9% |
| `/admin-dashboard/departments` | 824.6 KB | 736.7 KB | 255.4 KB | 232.1 KB | -9.1% |
| `/admin-dashboard/departments/[departmentId]` | 1242.7 KB | 1231.8 KB | 356.1 KB | 353.3 KB | -0.8% |
| `/admin-dashboard/faculties` | 1278.3 KB | 745.2 KB | 361.8 KB | 234.6 KB | -35.2% |
| `/admin-dashboard/fee-structures` | 1329.8 KB | 744.9 KB | 379.9 KB | 234.5 KB | -38.3% |
| `/admin-dashboard/fee-structures/[feeStructureId]/items` | 1278.7 KB | 744.8 KB | 361.9 KB | 234.5 KB | -35.2% |
| `/admin-dashboard/grade-scales` | 1277.6 KB | 744.7 KB | 361.7 KB | 234.4 KB | -35.2% |
| `/admin-dashboard/grade-scales/[gradeScaleId]` | 1329.9 KB | 744.8 KB | 380.0 KB | 234.5 KB | -38.3% |
| `/admin-dashboard/instructor-registration` | 1253.3 KB | 1241.8 KB | 357.6 KB | 354.6 KB | -0.8% |
| `/admin-dashboard/instructors` | 824.1 KB | 736.2 KB | 255.2 KB | 231.9 KB | -9.1% |
| `/admin-dashboard/instructors/[instructorId]` | 1245.4 KB | 1233.9 KB | 356.8 KB | 353.8 KB | -0.9% |
| `/admin-dashboard/invoices` | 946.6 KB | 744.7 KB | 291.0 KB | 234.4 KB | -19.4% |
| `/admin-dashboard/invoices/[invoiceId]` | 895.8 KB | 808.5 KB | 273.0 KB | 249.9 KB | -8.5% |
| `/admin-dashboard/program-courses` | 1328.8 KB | 744.9 KB | 379.6 KB | 234.5 KB | -38.2% |
| `/admin-dashboard/programs` | 824.1 KB | 736.2 KB | 255.2 KB | 231.9 KB | -9.1% |
| `/admin-dashboard/programs/[programId]` | 1243.5 KB | 1232.0 KB | 356.1 KB | 353.1 KB | -0.9% |
| `/admin-dashboard/registrations` | 744.7 KB | 733.2 KB | 233.8 KB | 230.8 KB | -1.3% |
| `/admin-dashboard/rooms` | 1277.2 KB | 744.7 KB | 361.5 KB | 234.4 KB | -35.1% |
| `/admin-dashboard/scholarships` | 1331.7 KB | 744.8 KB | 379.8 KB | 234.5 KB | -38.3% |
| `/admin-dashboard/sections` | 1339.0 KB | 750.7 KB | 382.0 KB | 236.0 KB | -38.2% |
| `/admin-dashboard/semesters` | 1329.4 KB | 744.8 KB | 379.8 KB | 234.5 KB | -38.3% |
| `/admin-dashboard/student-registration` | 1251.1 KB | 1239.5 KB | 357.5 KB | 354.5 KB | -0.8% |
| `/admin-dashboard/student-scholarships` | 1328.3 KB | 744.9 KB | 379.6 KB | 234.5 KB | -38.2% |
| `/admin-dashboard/students` | 825.0 KB | 741.6 KB | 255.4 KB | 233.5 KB | -8.6% |
| `/admin-dashboard/students/[studentId]` | 1248.2 KB | 1236.7 KB | 357.2 KB | 354.2 KB | -0.9% |
| `/admissions` | 774.9 KB | 774.7 KB | 244.8 KB | 244.5 KB | -0.1% |
| `/campus-life` | 774.9 KB | 774.7 KB | 244.8 KB | 244.5 KB | -0.1% |
| `/courses` | 779.4 KB | 779.5 KB | 246.5 KB | 246.3 KB | -0.1% |
| `/departments` | 779.4 KB | 779.5 KB | 246.5 KB | 246.3 KB | -0.1% |
| `/instructor-dashboard` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/instructor-dashboard/attendance` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/instructor-dashboard/attendance/[sessionId]` | 792.0 KB | 817.0 KB | 250.4 KB | 258.4 KB | +3.2% |
| `/instructor-dashboard/profile` | 746.8 KB | 735.3 KB | 234.3 KB | 231.3 KB | -1.3% |
| `/instructor-dashboard/sections` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/instructor-dashboard/sections/[sectionId]` | 743.1 KB | 731.8 KB | 233.4 KB | 230.4 KB | -1.3% |
| `/login` | 685.4 KB | 685.5 KB | 216.3 KB | 216.2 KB | -0.0% |
| `/payment/cancel` | 652.9 KB | 652.9 KB | 204.5 KB | 204.5 KB | +0.0% |
| `/payment/failed` | 652.9 KB | 652.9 KB | 204.5 KB | 204.5 KB | +0.0% |
| `/payment/success` | 652.9 KB | 652.9 KB | 204.5 KB | 204.5 KB | +0.0% |
| `/programs` | 779.4 KB | 779.5 KB | 246.5 KB | 246.3 KB | -0.1% |
| `/research` | 774.9 KB | 774.7 KB | 244.8 KB | 244.5 KB | -0.1% |
| `/student-dashboard` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/student-dashboard/course-registration` | 752.3 KB | 743.5 KB | 236.1 KB | 233.9 KB | -0.9% |
| `/student-dashboard/payment-history` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/student-dashboard/profile` | 798.8 KB | 787.3 KB | 252.2 KB | 249.2 KB | -1.2% |
| `/student-dashboard/registration-status` | 739.6 KB | 728.1 KB | 231.9 KB | 228.9 KB | -1.3% |
| `/verify-instructor` | 683.2 KB | 683.2 KB | 215.5 KB | 215.4 KB | -0.0% |
| `/verify-student` | 684.5 KB | 684.5 KB | 216.0 KB | 215.9 KB | -0.0% |

## Client packages on `/admin-dashboard` (analyzer, all client JS incl. lazy chunks)

| Package | before | after |
| --- | ---: | ---: |
| next | 558.2 KB | 558.3 KB |
| @base-ui/react | 127.2 KB | 127.2 KB |
| (app code) | 40.6 KB | 37.9 KB |
| sonner | 34.8 KB | 34.8 KB |
| cn | 24.5 KB | 24.5 KB |
| lucide-react | 19.2 KB | 10.4 KB |
| @base-ui/utils | 15.1 KB | 15.1 KB |
| @floating-ui/core | 10.3 KB | 10.3 KB |
| @floating-ui/dom | 7.9 KB | 7.9 KB |
| @floating-ui/utils | 4.6 KB | 4.6 KB |
| @floating-ui/react-dom | 2.6 KB | 2.6 KB |
| use-sync-external-store | 1.6 KB | 1.6 KB |
| @swc/helpers | 0.8 KB | 0.8 KB |
| class-variance-authority | 0.7 KB | 0.7 KB |
| clsx | 0.4 KB | 0.4 KB |

## Client packages on `/admin-dashboard/students` (analyzer, all client JS incl. lazy chunks)

| Package | before | after |
| --- | ---: | ---: |
| next | 558.5 KB | 562.7 KB |
| @base-ui/react | 127.2 KB | 127.2 KB |
| sweetalert2 | 74.2 KB | 74.3 KB |
| (app code) | 48.5 KB | 50.9 KB |
| sonner | 34.8 KB | 34.8 KB |
| cn | 24.5 KB | 24.5 KB |
| lucide-react | 21.1 KB | 13.0 KB |
| @base-ui/utils | 15.1 KB | 15.1 KB |
| @floating-ui/core | 10.3 KB | 10.3 KB |
| @floating-ui/dom | 7.9 KB | 7.9 KB |
| @floating-ui/utils | 4.6 KB | 4.6 KB |
| @floating-ui/react-dom | 2.6 KB | 2.6 KB |
| use-sync-external-store | 1.6 KB | 1.6 KB |
| @swc/helpers | 0.8 KB | – |
| class-variance-authority | 0.7 KB | – |
| @tanstack/virtual-core | – | 32.0 KB |
| @tanstack/react-virtual | – | 1.9 KB |

## Client packages on `/admin-dashboard/invoices` (analyzer, all client JS incl. lazy chunks)

| Package | before | after |
| --- | ---: | ---: |
| next | 558.5 KB | 562.7 KB |
| @base-ui/react | 172.5 KB | 172.5 KB |
| sweetalert2 | 74.2 KB | 74.3 KB |
| (app code) | 59.6 KB | 56.9 KB |
| @tanstack/form-core | 50.6 KB | 50.6 KB |
| sonner | 34.8 KB | 34.8 KB |
| cn | 24.5 KB | 24.5 KB |
| lucide-react | 22.2 KB | 13.5 KB |
| @base-ui/utils | 15.5 KB | 15.5 KB |
| @floating-ui/core | 10.3 KB | 10.3 KB |
| @floating-ui/dom | 7.9 KB | 7.9 KB |
| @floating-ui/utils | 4.6 KB | 4.6 KB |
| @tanstack/store | 4.3 KB | 4.3 KB |
| @tanstack/devtools-event-client | 4.0 KB | 4.0 KB |
| @tanstack/react-form | 3.7 KB | 3.7 KB |

## Client packages on `/admin-dashboard/sections` (analyzer, all client JS incl. lazy chunks)

| Package | before | after |
| --- | ---: | ---: |
| next | 558.5 KB | 562.7 KB |
| zod | 381.1 KB | 381.1 KB |
| @base-ui/react | 172.5 KB | 186.2 KB |
| sweetalert2 | 74.2 KB | 74.3 KB |
| (app code) | 70.1 KB | 68.4 KB |
| @tanstack/form-core | 50.6 KB | 50.6 KB |
| sonner | 34.8 KB | 34.8 KB |
| cn | 24.5 KB | 24.5 KB |
| lucide-react | 22.1 KB | 14.4 KB |
| @base-ui/utils | 15.5 KB | 15.5 KB |
| @floating-ui/core | 10.3 KB | 10.3 KB |
| @floating-ui/dom | 7.9 KB | 7.9 KB |
| @floating-ui/utils | 4.6 KB | 4.6 KB |
| @tanstack/store | 4.3 KB | 4.3 KB |
| @tanstack/devtools-event-client | 4.0 KB | 4.0 KB |

## Client packages on `/student-dashboard/course-registration` (analyzer, all client JS incl. lazy chunks)

| Package | before | after |
| --- | ---: | ---: |
| next | 558.6 KB | 558.6 KB |
| @base-ui/react | 127.2 KB | 127.2 KB |
| (app code) | 51.6 KB | 51.1 KB |
| sonner | 34.8 KB | 34.8 KB |
| cn | 24.5 KB | 24.5 KB |
| lucide-react | 20.5 KB | 12.3 KB |
| @base-ui/utils | 15.1 KB | 15.1 KB |
| @floating-ui/core | 10.3 KB | 10.3 KB |
| @floating-ui/dom | 7.9 KB | 7.9 KB |
| @floating-ui/utils | 4.6 KB | 4.6 KB |
| @floating-ui/react-dom | 2.6 KB | 2.6 KB |
| use-sync-external-store | 1.6 KB | 1.6 KB |
| @swc/helpers | 0.8 KB | 0.8 KB |
| class-variance-authority | 0.7 KB | 0.7 KB |
| clsx | 0.4 KB | 0.4 KB |
