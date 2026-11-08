import type { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

/**
 * Opens a SweetAlert2 dialog, but only downloads the library (~74 KB) the first
 * time a dialog is actually needed (e.g. after a Delete click). Before this,
 * every table page shipped sweetalert2 in its initial JavaScript.
 */
export async function confirmDialog(
  options: SweetAlertOptions,
): Promise<SweetAlertResult> {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(options);
}

/** Warm the chunk up front (e.g. on hover) so the dialog opens instantly. */
export function preloadConfirmDialog() {
  void import("sweetalert2");
}
