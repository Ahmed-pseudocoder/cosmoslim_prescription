import { PatientRecord } from '../types';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
   interface Navigator {
    // FIX: The original declarations for `canShare` and `share` used an optional
    // property modifier (`?`) which caused a conflict with other globally
    // available TypeScript definitions. Removing the optional modifier and
    // using standard method syntax resolves the "identical modifiers" error.
    canShare(data?: ShareData): boolean;
    share(data?: ShareData): Promise<void>;
  }
  interface ShareData {
    files?: File[];
    title?: string;
    text?: string;
    url?: string;
  }
}

const generatePrescriptionHTML = (record: PatientRecord): string => {
  const logoFont = "'Times New Roman', Times, serif";

  return `
    <div id="pdf-content" style="width: 210mm; min-height: 297mm; font-family: 'Helvetica', 'Arial', sans-serif; background: white; box-sizing: border-box; display: flex; flex-direction: column;">
      
      <!-- Header -->
      <div style="background-color: #8a837f; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: start; flex-shrink: 0;">
        <!-- Left Header -->
        <div style="font-size: 12px; line-height: 1.5;">
          <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">CosmoSlim Aesthetic Clinic</h2>
          <p style="margin: 0;">Near VIP Function Hall,</p>
          <p style="margin: 0;">Above Mediseva Medical,</p>
          <p style="margin: 0;">Central Naka Road, Aurangabad.</p>
          <div style="margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Contact No.</p>
            <p style="margin: 0;">+91 - 8317286155</p>
            <p style="margin: 0;">+91 - 9922801806</p>
          </div>
        </div>
        <!-- Right Header -->
        <div style="text-align: right; font-size: 12px; line-height: 1.5;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0;">Dr. Heena Fatema</h1>
          <p style="margin: 0;">B.A.M.S., PG Dip. in</p>
          <p style="margin: 0;">Clinical Cosmetology</p>
          <p style="margin: 0; font-weight: bold; margin-top: 5px;">Expert in Cosmetic Dermatology</p>
          <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 15px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 50px; height: 50px; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; font-family: ${logoFont};">
                CS
              </div>
              <div style="font-size: 10px; letter-spacing: 2px; margin-top: 5px;">COSMOSLIM</div>
            </div>
          </div>
          <p style="margin: 15px 0 0 0; font-weight: bold;">OPD: 11:00 am to 09:00 pm</p>
        </div>
      </div>

      <!-- Body -->
      <div style="display: flex; flex-grow: 1;">
        <!-- Left Column (Patient Info) -->
        <div style="width: 35%; padding: 40px 20px 40px 40px; box-sizing: border-box; display: flex; flex-direction: column; font-size: 14px; color: #333; line-height: 1.6;">
          <div style="margin-bottom: 25px;"><strong>Name:</strong><br>${record.patientName || '&nbsp;'}</div>
          <div style="margin-bottom: 25px;"><strong>Age:</strong><br>${record.age || '&nbsp;'}</div>
          <div style="margin-bottom: 25px;"><strong>Date:</strong><br>${record.date || '&nbsp;'}</div>
          <div style="margin-bottom: 25px;"><strong>Treatment:</strong><br>${record.treatment || '&nbsp;'}</div>
          <div style="margin-bottom: 25px;"><strong>Follow up:</strong><br>${record.followUpDate || '&nbsp;'}</div>
          <div style="margin-bottom: 25px;"><strong>Instructions:</strong><br><div style="white-space: pre-wrap; word-wrap: break-word;">${record.instructions || '&nbsp;'}</div></div>
          <div style="flex-grow: 1;"></div> <!-- Spacer -->
          <div style="margin-top: 25px;"><strong>Session:</strong><br>${record.session || '&nbsp;'}</div>
        </div>
        <!-- Right Column (Prescription) -->
        <div style="width: 65%; border-left: 1px solid #ccc; padding: 40px; box-sizing: border-box; position: relative;">
          <!-- Watermark -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 250px; font-weight: bold; color: #eeeeee; z-index: 0; font-family: ${logoFont}; user-select: none;">
            CS
          </div>
          
          <!-- Rx Symbol -->
          <div style="font-family: ${logoFont}; font-size: 50px; font-weight: bold; position: relative; z-index: 1;">&#8478;</div>
          
          <!-- Signature -->
          <div style="position: absolute; bottom: 60px; right: 40px; font-size: 14px; z-index: 1;">
            <div style="min-width: 200px; text-align: center; border-top: 1px solid #333; padding-top: 5px;">Doctor's Signature</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const generatePdfBlob = (record: PatientRecord): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;

    const contentContainer = document.createElement('div');
    contentContainer.style.position = 'absolute';
    contentContainer.style.left = '-9999px';
    contentContainer.style.width = '210mm';
    contentContainer.innerHTML = generatePrescriptionHTML(record);
    document.body.appendChild(contentContainer);

    const pdfContent = document.getElementById('pdf-content');
    if (!pdfContent) {
      document.body.removeChild(contentContainer);
      return reject(new Error("PDF content element not found"));
    }

    html2canvas(pdfContent, { scale: 2, useCORS: true })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const blob = pdf.output('blob');
        document.body.removeChild(contentContainer);
        resolve(blob);
      })
      .catch(err => {
        console.error("Error generating PDF canvas:", err);
        document.body.removeChild(contentContainer);
        reject(err);
      });
  });
};


export const shareOrDownloadPdf = async (record: PatientRecord): Promise<void> => {
  try {
    const pdfBlob = await generatePdfBlob(record);
    const fileName = `Prescription-${record.patientName.replace(/\s/g, '_')}-${record.date}.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Use Web Share API if available (on mobile)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        files: [pdfFile],
        title: `Prescription for ${record.patientName}`,
        text: `Here is the prescription for ${record.patientName} from CosmoSlim Clinic.`,
      });
    } else {
      // Fallback to download on desktop
      const { jsPDF } = window.jspdf;
      const pdf = jsPDF(); // We need a jspdf instance to call save
      pdf.save(pdfBlob, { filename: fileName });
      
      // A more robust download fallback
      const link = document.createElement('a');
      const url = URL.createObjectURL(pdfBlob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Failed to generate or share PDF:", error);
    alert("Could not generate or share the PDF. Please try again.");
  }
};