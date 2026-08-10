import React, { useRef, useState } from 'react';
import { FileBarChart, Download, Loader2 } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function TeacherReports() {
  const [showReport, setShowReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Class_Performance_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Class Performance Reports</h1>
        {showReport && (
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </button>
        )}
      </div>

      {!showReport ? (
        <EmptyState
          title="No reports generated yet"
          description="Select a course and student cohort to generate real-time analytics and progress reports."
          icon={FileBarChart}
          action={{
            label: 'Generate Report',
            onClick: () => setShowReport(true),
          }}
        />
      ) : (
        <div ref={reportRef} className="bg-white p-8 md:p-12 rounded-2xl border border-neutral-200 shadow-sm print:border-none print:shadow-none print:p-0">
          <div className="border-b border-neutral-200 pb-8 mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Class Performance Report</h1>
            <p className="text-lg text-neutral-500">AIES Platform - Generated {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Summary</h3>
              <p className="text-neutral-600">The overall class performance has been steady this month. Students have completed 85% of assigned modules, and the average quiz score is 82%. Excellent engagement observed in science topics.</p>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-4 font-bold text-neutral-600">Student Name</th>
                  <th className="py-4 font-bold text-neutral-600">Modules Completed</th>
                  <th className="py-4 font-bold text-neutral-600">Average Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-4">Alice Johnson</td>
                  <td className="py-4">12 / 15</td>
                  <td className="py-4 font-bold text-green-600">92%</td>
                </tr>
                <tr>
                  <td className="py-4">Bob Smith</td>
                  <td className="py-4">15 / 15</td>
                  <td className="py-4 font-bold text-green-600">95%</td>
                </tr>
                <tr>
                  <td className="py-4">Charlie Brown</td>
                  <td className="py-4">8 / 15</td>
                  <td className="py-4 font-bold text-amber-600">74%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
