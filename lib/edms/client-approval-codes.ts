export const CLIENT_APPROVAL_OPTIONS = [
  {
    approvalCode: "A",
    label: "Approved - No Comments",
    reviewStatus: "approved",
  },
  {
    approvalCode: "A1",
    label: "Approved - As Noted",
    reviewStatus: "approved",
  },
  {
    approvalCode: "A2",
    label: "Approved - With Comments",
    reviewStatus: "approved",
  },
  {
    approvalCode: "R",
    label: "Returned - No Action",
    reviewStatus: "returned",
  },
  {
    approvalCode: "R1",
    label: "Returned - For Revision",
    reviewStatus: "returned",
  },
  {
    approvalCode: "R2",
    label: "Returned - For Information",
    reviewStatus: "returned",
  },
  { approvalCode: "N", label: "No Action Required", reviewStatus: "no_action" },
] as const;

export type ClientApprovalCode =
  (typeof CLIENT_APPROVAL_OPTIONS)[number]["approvalCode"];

export function getReviewStatusForApprovalCode(code: string): string {
  const option = CLIENT_APPROVAL_OPTIONS.find(
    (opt) => opt.approvalCode === code,
  );
  return option?.reviewStatus || "pending";
}
