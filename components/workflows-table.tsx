"use client";

import Link from "next/link";
import {
  EdmsStatusBadge,
  formatEdmsLabel,
} from "@/components/edms/status-badge";
import { WorkflowActionSheet } from "@/components/edms/workflow-action-sheet";

interface WorkflowStep {
  id: string;
  workflowId: string;
  stepName: string;
  workflowName: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  documentNumber: string;
  projectName: string;
  status: string;
  assignedToName: string;
  assignedRole: string;
  dueLabel: string;
  isActionable: boolean;
  projectId: string;
}

interface WorkflowsTableProps {
  steps: WorkflowStep[];
}

export function WorkflowsTable({ steps }: WorkflowsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Step</th>
                <th className="px-4 py-3 text-left font-medium">Document</th>
                <th className="px-4 py-3 text-left font-medium">Project</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Assignee</th>
                <th className="px-4 py-3 text-left font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/workflows/${step.workflowId}`}
                      className="block"
                    >
                      <div className="space-y-1">
                        <p className="font-medium hover:text-primary">
                          {step.stepName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.workflowName} · Step {step.stepNumber} of{" "}
                          {step.totalSteps}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p>{step.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {step.documentNumber}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{step.projectName}</td>
                  <td className="px-4 py-3">
                    <EdmsStatusBadge status={step.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p>{step.assignedToName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatEdmsLabel(step.assignedRole)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">
                        {step.dueLabel}
                      </span>
                      <WorkflowActionSheet
                        stepId={step.id}
                        title={`${step.documentNumber} - ${step.title}`}
                        isActionable={step.isActionable}
                        projectId={step.projectId}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
