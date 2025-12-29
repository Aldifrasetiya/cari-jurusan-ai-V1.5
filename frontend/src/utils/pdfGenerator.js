import jsPDF from 'jspdf';

export const generatePDFResult = (minatResult, raporScores, raporInsights) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Cari Jurusan AI", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Laporan Analisis Potensi & Akademik Siswa", 20, 28);
    
    const date = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Tanggal: ${date}`, pageWidth - 20, 20, { align: 'right' });

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("Berdasarkan analisis minat & bakat, kamu paling cocok di:", 20, 55);
    
    doc.setFillColor(240, 248, 255);
    doc.setDrawColor(79, 70, 229);
    doc.roundedRect(20, 60, pageWidth - 40, 25, 3, 3, 'FD');
    
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const prediction = minatResult?.prediction || "Analisis Belum Lengkap";
    doc.text(prediction.toUpperCase(), pageWidth / 2, 77, { align: 'center' });

    let yPos = 100;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("1. Profil Minat & Kemampuan", 20, yPos);
    yPos += 10;

    if (minatResult?.input_scores) {
        Object.entries(minatResult.input_scores).forEach(([key, value]) => {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.text(key.charAt(0).toUpperCase() + key.slice(1), 20, yPos);
            
            doc.setFillColor(230, 230, 230);
            doc.rect(50, yPos - 3, 100, 4, 'F');
            
            if (value > 0.7) doc.setFillColor(34, 197, 94);
            else if (value > 0.4) doc.setFillColor(59, 130, 246);
            else doc.setFillColor(234, 179, 8);
            
            doc.rect(50, yPos - 3, 100 * value, 4, 'F');
            
            doc.text(`${(value * 100).toFixed(0)}%`, 155, yPos);
            
            yPos += 10;
        });
    }

    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("2. Validasi Data Akademik (Rapor)", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    if (raporInsights && raporInsights.length > 0) {
        raporInsights.forEach((insight) => {
            const cleanText = insight.replace(/\*\*/g, ''); 
            
            const lines = doc.splitTextToSize(`• ${cleanText}`, pageWidth - 40);
            doc.text(lines, 20, yPos);
            yPos += (lines.length * 6); // Spasi antar poin
        });
    } else {
        doc.text("- Data rapor belum diinputkan.", 20, yPos);
        yPos += 10;
    }

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Nilai Input:", 20, yPos);
    yPos += 8;
    doc.setFont("helvetica", "normal");
    
    const displayMapel = ['matematika', 'fisika', 'kimia', 'biologi', 'ekonomi', 'sosiologi'];
    let xPos = 20;
    displayMapel.forEach((m, i) => {
        if (raporScores[m] > 0) {
            doc.text(`${m.charAt(0).toUpperCase() + m.slice(1)}: ${raporScores[m]}`, xPos, yPos);
            xPos += 50;
            if (xPos > 150) {
                xPos = 20;
                yPos += 6;
            }
        }
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Laporan ini digenerate secara otomatis oleh AI Cari Jurusan.", 20, 280);
    doc.text("www.carijurusan.my.id", pageWidth - 20, 280, { align: 'right' });
    doc.save(`Hasil_Analisis_${prediction}.pdf`);
};