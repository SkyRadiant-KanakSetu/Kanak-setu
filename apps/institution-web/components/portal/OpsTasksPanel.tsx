'use client';

import { useState } from 'react';

type Props = {
  tasks: any[];
  functionsList: any[];
  onCreateTask: (payload: any) => Promise<void>;
};

export function OpsTasksPanel({ tasks, functionsList, onCreateTask }: Props) {
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState('PRE_EVENT');
  const [functionId, setFunctionId] = useState('');
  const [dueDate, setDueDate] = useState('');
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">Create Operations Task</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="rounded border px-3 py-2 text-sm"
          />
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="rounded border px-3 py-2 text-sm">
            {['PRE_EVENT', 'EVENT_DAY', 'POST_EVENT', 'DONOR_FOLLOWUP', 'COMPLIANCE', 'OTHER'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={functionId} onChange={(e) => setFunctionId(e.target.value)} className="rounded border px-3 py-2 text-sm">
            <option value="">No linked function</option>
            {functionsList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded border px-3 py-2 text-sm" />
          <button
            onClick={async () => {
              if (!title.trim()) return;
              await onCreateTask({
                title: title.trim(),
                taskType,
                functionId: functionId || undefined,
                dueDate: dueDate || undefined,
              });
              setTitle('');
              setFunctionId('');
              setDueDate('');
            }}
            className="rounded bg-amber-700 px-3 py-2 text-sm text-white hover:bg-amber-800"
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-xs text-gray-500">
                  {t.taskType} {t.spiritualFunction?.name ? `• ${t.spiritualFunction.name}` : ''}
                </p>
              </div>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-xs">{t.status}</span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks yet.</p>}
      </div>
    </div>
  );
}
