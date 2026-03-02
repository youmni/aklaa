import jsPDF from 'jspdf';

/**
 * Export grocery list data as PDF file
 * @param {Object} groceryData - The grocery list object to export
 * @param {Function} t - Translation function
 * @param {String} theme - Theme mode: 'light' or 'dark'
 */
export const exportGroceryListAsPDF = async (groceryData, t, theme = 'light') => {
  const doc = new jsPDF();
  let yPosition = 0;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let bgColor, boxBg, cyan, textColor, mediumGray, white, borderColor, categoryBg;
  
  if (theme === 'light') {
    bgColor = [255, 255, 255];
    boxBg = [243, 244, 246]; 
    categoryBg = [249, 250, 251];
    cyan = [25, 55, 109];
    textColor = [17, 24, 39];
    mediumGray = [107, 114, 128];
    white = [255, 255, 255];
    borderColor = [209, 213, 219];
  } else {
    bgColor = [30, 41, 59];
    boxBg = [51, 65, 85];
    categoryBg = [51, 65, 85];
    cyan = [14, 165, 233];
    textColor = [241, 245, 249]
    mediumGray = [148, 163, 184];
    white = [255, 255, 255];
    borderColor = [71, 85, 105];
  }

  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 35) {
      addFooter();
      doc.addPage();
      doc.setFillColor(...bgColor);
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
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const europeanDate = `${day}/${month}/${year}`;
    
    doc.text('Aklaa', margin, pageHeight - 12);
    doc.text(`${pageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text(europeanDate, pageWidth - margin, pageHeight - 12, { align: 'right' });
  };

  const formatDate = (dateInput) => {
    if (!dateInput) {
      console.error('No date provided');
      return null;
    }
    
    let date;
    // Handle array format from Java LocalDate [year, month, day]
    if (Array.isArray(dateInput) && dateInput.length === 3) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
      return null;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatQuantity = (quantity, unit) => {
    const formatted = quantity % 1 === 0 ? quantity.toFixed(0) : quantity.toFixed(2);
    return `${formatted} ${t(`units.${unit}`)}`;
  };

  const groupByCategory = (ingredients) => {
    const grouped = {};
    ingredients.forEach(item => {
      const category = item.ingredient.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  // Set background
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  yPosition = 20;
  
  // Title
  doc.setTextColor(...cyan);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text(t('common.groceryList'), margin, yPosition);
  
  yPosition += 12;

  if (groceryData.startOfWeek && groceryData.endOfWeek) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...textColor);
    const startFormatted = formatDate(groceryData.startOfWeek);
    const endFormatted = formatDate(groceryData.endOfWeek);
    if (startFormatted && endFormatted) {
      const dateRange = `${startFormatted} - ${endFormatted}`;
      doc.text(dateRange, margin, yPosition);
      yPosition += 10;
    }
  }

  // Total items
  doc.setFontSize(10);
  doc.setTextColor(...mediumGray);
  const totalText = `${t('common.total')}: ${groceryData.totalElements} ${groceryData.totalElements === 1 ? t('details.item') : t('details.items')}`;
  doc.text(totalText, margin, yPosition);
  
  yPosition += 15;

  // Group ingredients by category
  const groupedIngredients = groupByCategory(groceryData.ingredients);

  // Render each category
  Object.entries(groupedIngredients).forEach(([category, items], index) => {
    checkPageBreak(30);

    // Category header
    doc.setFillColor(...categoryBg);
    doc.roundedRect(margin, yPosition - 6, contentWidth, 12, 2, 2, 'F');
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...cyan);
    doc.text(t(`categories.${category}`), margin + 3, yPosition);
    
    // Item count badge
    const categoryText = `${items.length} ${items.length === 1 ? t('details.item') : t('details.items')}`;
    const badgeWidth = doc.getTextWidth(categoryText) + 8;
    const badgeX = pageWidth - margin - badgeWidth;
    
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.text(categoryText, badgeX + 4, yPosition);
    
    yPosition += 15;

    // Render items in this category
    items.forEach((item, itemIndex) => {
      checkPageBreak(15);

      // Checkbox
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPosition - 4, 4, 4);

      // Item name
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...textColor);
      const itemName = item.ingredient.name;
      const maxNameWidth = contentWidth - 50;
      const nameLines = doc.splitTextToSize(itemName, maxNameWidth);
      doc.text(nameLines, margin + 7, yPosition);

      // Quantity badge
      const quantityText = formatQuantity(item.quantity, item.ingredient.unit);
      const quantityWidth = doc.getTextWidth(quantityText) + 6;
      const quantityX = pageWidth - margin - quantityWidth;
      
      doc.setFillColor(...boxBg);
      doc.roundedRect(quantityX, yPosition - 4.5, quantityWidth, 6, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...textColor);
      doc.text(quantityText, quantityX + 3, yPosition);

      yPosition += (nameLines.length * 5) + 5;
    });

    yPosition += 5;
  });

  // Add footer to last page
  addFooter();

  // Generate filename
  let filename;
  if (groceryData.startOfWeek && groceryData.endOfWeek) {
    const startFormatted = formatDate(groceryData.startOfWeek);
    const endFormatted = formatDate(groceryData.endOfWeek);
    if (startFormatted && endFormatted) {
      const startDate = startFormatted.replace(/\//g, '-');
      const endDate = endFormatted.replace(/\//g, '-');
      filename = `grocery_list_${startDate}_${endDate}.pdf`;
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      filename = `grocery_list_${day}-${month}-${year}.pdf`;
    }
  } else {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    filename = `grocery_list_${day}-${month}-${year}.pdf`;
  }

  // Save the PDF
  doc.save(filename);
};
