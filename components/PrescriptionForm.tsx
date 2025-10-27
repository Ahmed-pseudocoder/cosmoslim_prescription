import React, { useState } from 'react';
import { PatientRecord, Treatment } from '../types';
import { TREATMENTS } from '../constants';
import { shareOrDownloadPdf } from '../services/pdfService';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

interface PrescriptionFormProps {
  onSave: (record: PatientRecord) => Promise<void>;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [date, setDate] = useState(today);
  const [treatment, setTreatment] = useState<Treatment>(TREATMENTS[0]);
  const [session, setSession] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setPatientName('');
    setAge('');
    setDate(today);
    setTreatment(TREATMENTS[0]);
    setSession('');
    setFollowUpDate('');
    setInstructions('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !treatment) {
      setError('Patient Name and Treatment are required.');
      return;
    }
    
    setIsSaving(true);
    setError('');

    const newRecord: PatientRecord = {
      timestamp: new Date().toISOString(),
      patientName,
      age,
      date,
      treatment,
      session,
      followUpDate,
      instructions,
    };
    
    try {
      await onSave(newRecord);
      await shareOrDownloadPdf(newRecord);
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Failed to save the record. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">New Prescription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Patient Name"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          disabled={isSaving}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age"
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={isSaving}
          />
          <Input
            label="Visit Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSaving}
            required
          />
        </div>
        <Select
          label="Treatment"
          id="treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value as Treatment)}
          options={TREATMENTS.map(t => ({ value: t, label: t }))}
          disabled={isSaving}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Session"
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder="e.g., 1st, 2nd"
            disabled={isSaving}
          />
          <Input
            label="Follow-up Date"
            id="followUpDate"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <Textarea
          label="Instructions / Notes"
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
          disabled={isSaving}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-2">
          <Button type="submit" fullWidth disabled={isSaving}>
            {isSaving ? 'Saving & Generating...' : 'Generate Prescription & Save Record'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
