import jsPDF from 'jspdf';

/**
 * Export dish data as JSON file
 * @param {Object} dish - The dish object to export
 */
export const exportDishAsJSON = (dish) => {
  const dataStr = JSON.stringify(dish, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${dish.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export dish data as PDF file
 * @param {Object} dish - The dish object to export
 * @param {Function} t - Translation function
 */
export const exportDishAsPDF = async (dish, t) => {
  const doc = new jsPDF();
  let yPosition = 0;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const darkBg = [30, 41, 59];
  const boxBg = [51, 65, 85];
  const cyan = [14, 165, 233];
  const lightText = [241, 245, 249];
  const mediumGray = [148, 163, 184];
  const white = [255, 255, 255];

  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 35) {
      addFooter();
      doc.addPage();
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addFooter = () => {
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
    
    doc.setDrawColor(...mediumGray);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont(undefined, 'normal');
    
    doc.text('Aklaa', margin, pageHeight - 12);
    doc.text(`${pageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, pageHeight - 12, { align: 'right' });
  };

  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPosition = 20;
  doc.setTextColor(...cyan);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  const dishNameLines = doc.splitTextToSize(dish.name, contentWidth);
  doc.text(dishNameLines, margin, yPosition);
  
  yPosition += (dishNameLines.length * 8) + 8;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...lightText);
  
  const servingsText = `${dish.people} ${dish.people === 1 ? t('details.serving') : t('details.servings')}`;
  doc.text(servingsText, margin, yPosition);
  
  const cuisineText = t(`cuisines.${dish.type}`);
  const servingsWidth = doc.getTextWidth(servingsText);
  const xPosCuisine = margin + servingsWidth + 15;
  const cuisineWidth = doc.getTextWidth(cuisineText) + 10;
  
  doc.setFillColor(...cyan);
  doc.roundedRect(xPosCuisine, yPosition - 5, cuisineWidth, 7, 3, 3, 'F');
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.roundedRect(xPosCuisine, yPosition - 5, cuisineWidth, 7, 3, 3);
  
  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text(cuisineText, xPosCuisine + 5, yPosition);
  
  yPosition += 15;

  if (dish.imageUrl) {
    try {
      const imgHeight = 90;
      const imgWidth = contentWidth;
      
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const cornerRadius = 8;
            
            doc.saveGraphicsState();
            
            const x = margin;
            const y = yPosition;
            const w = imgWidth;
            const h = imgHeight;
            const r = cornerRadius;
            
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, y, w, h, r, r, 'F');
            
            doc.addImage(img, 'JPEG', margin, yPosition, imgWidth, imgHeight, undefined, 'FAST');
            
            doc.restoreGraphicsState();
            
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(2);
            doc.rect(margin, yPosition, imgWidth, imgHeight);
            
            resolve();
          } catch (e) {
            console.error('Failed to add image to PDF:', e);
            resolve();
          }
        };
        img.onerror = () => {
          console.log('Image failed to load, continuing without it');
          resolve();
        };
        img.src = dish.imageUrl;
      });
      
      yPosition += imgHeight + 15;
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }

  yPosition += 3;
  
  doc.setTextColor(...cyan);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Tags', margin, yPosition);
  
  yPosition += 10;
  
  if (dish.tags && dish.tags.length > 0) {
    checkPageBreak(20);
    
    let xPos = margin;
    const tagHeight = 7;
    
    dish.tags.forEach((tag, index) => {
      const tagText = t(`tags.${tag}`);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const tagWidth = doc.getTextWidth(tagText) + 10;
      
      if (xPos + tagWidth > pageWidth - margin) {
        xPos = margin;
        yPosition += tagHeight + 3;
        checkPageBreak(12);
      }
      
      doc.setFillColor(...cyan);
      doc.roundedRect(xPos, yPosition - 5, tagWidth, tagHeight, 3, 3, 'F');
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(xPos, yPosition - 5, tagWidth, tagHeight, 3, 3);
      
      doc.setTextColor(...white);
      doc.setFont(undefined, 'bold');
      doc.text(tagText, xPos + 5, yPosition);
      
      xPos += tagWidth + 5;
    });
    
    yPosition += 18;
  }

  if (dish.description) {
    checkPageBreak(30);
    
    doc.setTextColor(...cyan);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t('common.description'), margin, yPosition);
    
    yPosition += 10;
    
    doc.setTextColor(...lightText);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    const descLines = doc.splitTextToSize(dish.description, contentWidth);
    doc.text(descLines, margin, yPosition);
    
    yPosition += (descLines.length * 5.5) + 15;
  }

  checkPageBreak(35);
  
  doc.setTextColor(...cyan);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(t('details.ingredients'), margin, yPosition);
  
  yPosition += 10;
  
  const ingredients = dish.dishIngredients || dish.ingredients || [];
  
  ingredients.forEach((ingredient, index) => {
    checkPageBreak(12);
    
    const ingredientName = ingredient.ingredientName || ingredient.ingredient?.name || 'Unknown';
    const quantity = ingredient.quantity || 0;
    const unit = ingredient.unit || ingredient.ingredient?.unit || '';
    
    doc.setFillColor(...boxBg);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 9, 3, 3, 'F');
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 9, 3, 3);
    
    doc.setTextColor(...cyan);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`${ingredientName}`, margin + 5, yPosition);
    
    doc.setTextColor(...lightText);
    doc.setFont(undefined, 'bold');
    const qtyText = `${quantity} ${unit}`;
    const qtyWidth = doc.getTextWidth(qtyText);
    doc.text(qtyText, pageWidth - margin - qtyWidth - 5, yPosition);
    
    yPosition += 11;
  });
  
  yPosition += 10;

  checkPageBreak(35);
  
  doc.setTextColor(...cyan);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(t('details.cookingSteps'), margin, yPosition);
  
  yPosition += 10;
  
  const steps = dish.cookingSteps || [];
  steps.forEach((step, index) => {
    const stepLines = doc.splitTextToSize(step.recipeStep, contentWidth - 12);
    const stepHeight = stepLines.length * 5.5 + 12;
    
    checkPageBreak(stepHeight + 6);
    
    doc.setFillColor(...boxBg);
    doc.roundedRect(margin, yPosition - 3, contentWidth, stepHeight, 3, 3, 'F');
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition - 3, contentWidth, stepHeight, 3, 3);
    
    doc.setTextColor(...mediumGray);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(`Step ${step.orderIndex}`, margin + 5, yPosition + 3);
    
    doc.setTextColor(...lightText);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(stepLines, margin + 5, yPosition + 9);
    
    yPosition += stepHeight + 7;
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  doc.save(`${dish.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};