import React, { useState, useEffect, useCallback } from 'react';
import { PatientRecord } from './types';
import PrescriptionForm from './components/PrescriptionForm';
import PatientDataTable from './components/PatientDataTable';
import { fetchRecords, saveRecord } from './services/googleSheetService';

const App: React.FC = () => {
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const records = await fetchRecords();
        setPatientRecords(records);
      } catch (err: any) {
        console.error("Failed to load records:", err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  const handleSaveRecord = useCallback(async (record: PatientRecord) => {
    // Optimistically update the UI
    setPatientRecords(prevRecords => [record, ...prevRecords]);
    try {
      await saveRecord(record);
    } catch (err: any) {
      console.error("Failed to save record:", err);
      // If save fails, revert the optimistic update and show an error
      setError("Failed to save record. Please try again.");
      setPatientRecords(prevRecords => prevRecords.filter(r => r.timestamp !== record.timestamp));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-teal-600 tracking-tight">
            CosmoSlim Clinic
          </h1>
          <p className="text-gray-500 mt-1">Prescription & Patient Data Management</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <PrescriptionForm onSave={handleSaveRecord} />
          </div>
          <div className="lg:col-span-2">
            <PatientDataTable records={patientRecords} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CosmoSlim Clinic Automator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
