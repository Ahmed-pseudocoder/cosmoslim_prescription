import React from 'react';
import { PatientRecord } from '../types';
import { exportToCSV } from '../services/csvService';
import Button from './ui/Button';

interface PatientDataTableProps {
  records: PatientRecord[];
  isLoading: boolean;
  error: string | null;
}

const PatientDataTable: React.FC<PatientDataTableProps> = ({ records, isLoading, error }) => {
  const handleExport = () => {
    exportToCSV(records, `cosmoslim-patient-records-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500 py-8">Loading patient history...</p>;
    }
    if (error) {
      return (
        <div className="text-center text-red-600 py-8">
            <p><strong>Error loading data.</strong></p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
            <p className="text-sm text-gray-600 mt-1">Please ensure you have followed the `INSTRUCTIONS.md` file correctly.</p>
        </div>
      )
    }
    if (records.length === 0) {
      return <p className="text-center text-gray-500 py-8">No patient records found. Add a new prescription to get started.</p>;
    }
    return (
       <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.timestamp} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.treatment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.followUpDate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
    );
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-2xl font-semibold text-gray-700">Patient History</h2>
        {!isLoading && !error && records.length > 0 && (
          <Button onClick={handleExport} variant="secondary">
            Export to CSV
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
       {renderContent()}
      </div>
    </div>
  );
};

export default PatientDataTable;
