import React from 'react';
import { EyeOff } from 'lucide-react';
import { formatCurrencyValue, getCurrencySymbol } from '../utils/constants';

interface StealthViewProps {
  onExit: () => void;
  todayEarned: number;
  currency: string;
}

export const StealthView: React.FC<StealthViewProps> = ({ onExit, todayEarned, currency }) => {
  const sym = getCurrencySymbol(currency);
  const earnedFormatted = formatCurrencyValue(todayEarned, currency, 2);

  return (
    <div
      onClick={onExit}
      className="fixed inset-0 z-50 bg-[#1E1E1E] text-[#D4D4D4] font-mono text-xs select-none cursor-pointer flex flex-col"
      title="点击任意处或按 ESC 退出伪装"
    >
      {/* VS Code titlebar */}
      <div className="bg-[#323233] px-3 py-1.5 flex items-center justify-between text-[#CCCCCC] text-[11px] border-b border-[#252526]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="ml-2 font-sans opacity-80">SalaryPush — app.controller.ts</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
          <EyeOff className="w-3 h-3" />
          <span>ESC 退出隐身</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-hidden leading-relaxed">
        <p className="text-[#6A9955]">/**</p>
        <p className="text-[#6A9955]"> * Production Cluster Worker Optimizer</p>
        <p className="text-[#6A9955]"> * High throughput message queue daemon</p>
        <p className="text-[#6A9955]"> */</p>
        <p className="text-[#569CD6]">import <span className="text-[#9CDCFE]">{'{ Injectable, OnModuleInit }'}</span> <span className="text-[#569CD6]">from</span> <span className="text-[#CE9178]'">'@nestjs/common'</span>;</p>
        <br />
        <p className="text-[#569CD6]">@Injectable()</p>
        <p><span className="text-[#569CD6]">export class</span> <span className="text-[#4EC9B0]">MetricsDaemonService</span> <span className="text-[#569CD6]">implements</span> <span className="text-[#4EC9B0]">OnModuleInit</span> {'{'}</p>
        <p className="pl-4"><span className="text-[#569CD6]">private readonly</span> <span className="text-[#9CDCFE]">heapTargetBytes</span> = <span className="text-[#B5CEA8]">104857600</span>;</p>
        <p className="pl-4"><span className="text-[#569CD6]">private</span> <span className="text-[#9CDCFE]">activeWorkerPool</span>: <span className="text-[#4EC9B0]">WorkerNode</span>[] = [];</p>
        <br />
        <p className="pl-4 text-[#6A9955]">// Real-time memory allocation profile (discreet payload):</p>
        <p className="pl-4 font-bold text-[#CE9178]">
          const currentAllocatedHeap = &quot;{currency.toUpperCase() === 'EUR' ? `${earnedFormatted} ${sym}` : `${sym}${earnedFormatted}`}&quot;;
        </p>
        <br />
        <p className="pl-4"><span className="text-[#DCDCAA]">async onModuleInit</span>(): <span className="text-[#4EC9B0]">Promise</span>&lt;<span className="text-[#569CD6]">void</span>&gt; {'{'}</p>
        <p className="pl-8"><span className="text-[#C586C0]">await</span> <span className="text-[#569CD6]">this</span>.<span className="text-[#DCDCAA]">rebalanceClusterWeights</span>();</p>
        <p className="pl-8"><span className="text-[#9CDCFE]">console</span>.<span className="text-[#DCDCAA]">info</span>(<span className="text-[#CE9178]">&apos;Cluster healthy. Process PID 4091 running.&apos;</span>);</p>
        <p className="pl-4">{'}'}</p>
        <p>{'}'}</p>
      </div>

      {/* Status Bar */}
      <div className="bg-[#007ACC] text-white px-3 py-1 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <span>main*</span>
          <span>0 errors, 0 warnings</span>
          <span className="font-mono bg-white/20 px-1 rounded">Mem: {earnedFormatted} KB</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 18, Col 32</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  );
};
