import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase.from("instruments").select();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Error loading instruments:</p>
        <p className="mt-1 font-mono text-sm">{error.message}</p>
        <p className="mt-2 text-xs text-red-600">
          Tip: Verify that the <code className="font-mono bg-red-100 px-1 py-0.5 rounded">instruments</code> table exists in your Supabase project and that RLS allows public select.
        </p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-semibold">No instruments found.</p>
        <p className="mt-1 text-sm">
          Execute the SQL insert snippet in your Supabase SQL Editor to populate sample instruments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-100">
          {instruments.map((instrument: { id: number; name: string }) => (
            <li
              key={instrument.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-medium capitalize text-gray-900">
                {instrument.name}
              </span>
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono text-gray-600">
                ID: {instrument.id}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-gray-500">Raw JSON Output:</h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400 shadow-inner">
          {JSON.stringify(instruments, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function Instruments() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Instruments
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Queried directly from Supabase via Next.js Server Component
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
            <span>Loading instruments...</span>
          </div>
        }
      >
        <InstrumentsData />
      </Suspense>
    </main>
  );
}
