/**
 * Gastos Família — Google Apps Script
 * Cole este código em script.google.com e publique como Web App.
 * Veja o README.md para instruções detalhadas.
 */

const SHEET_NAME = 'Gastos';
const SHEET_SUMMARY = 'Resumo';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let result;

    if (data.action === 'addExpense') {
      result = addExpenseRow(data.expense);
    } else if (data.action === 'exportMonth') {
      result = exportMonthData(data.year, data.month, data.expenses);
    } else {
      result = { status: 'error', message: 'Ação desconhecida' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Gastos Família API online' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEET_NAME) {
      sheet.getRange(1, 1, 1, 8).setValues([[
        'ID', 'Data', 'Pessoa', 'Categoria', 'Descrição', 'Valor (R$)', 'Criado em', 'Mês/Ano'
      ]]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.getRange('F:F').setNumberFormat('R$ #,##0.00');
    }
  }
  return sheet;
}

function addExpenseRow(expense) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const date = new Date(expense.date + 'T12:00:00');
  const monthYear = Utilities.formatDate(date, 'America/Sao_Paulo', 'MM/yyyy');

  // Check for duplicate
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === expense.id) {
      return { status: 'duplicate', message: 'Lançamento já existe' };
    }
  }

  sheet.appendRow([
    expense.id,
    expense.date,
    expense.person,
    expense.categoryLabel,
    expense.description,
    expense.amount,
    expense.createdAt,
    monthYear
  ]);

  updateSummary();
  return { status: 'ok', message: 'Lançamento adicionado' };
}

function exportMonthData(year, month, expenses) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const existing = sheet.getDataRange().getValues();
  const existingIds = new Set(existing.slice(1).map(r => r[0]));

  let added = 0;
  expenses.forEach(expense => {
    if (!existingIds.has(expense.id)) {
      const date = new Date(expense.date + 'T12:00:00');
      const monthYear = Utilities.formatDate(date, 'America/Sao_Paulo', 'MM/yyyy');
      sheet.appendRow([
        expense.id, expense.date, expense.person,
        expense.categoryLabel, expense.description,
        expense.amount, expense.createdAt, monthYear
      ]);
      added++;
    }
  });

  updateSummary();
  return { status: 'ok', message: `${added} lançamentos adicionados` };
}

function updateSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let summarySheet = ss.getSheetByName(SHEET_SUMMARY);
  if (!summarySheet) {
    summarySheet = ss.insertSheet(SHEET_SUMMARY);
  }
  summarySheet.clearContents();

  const sheet = getOrCreateSheet(SHEET_NAME);
  const data = sheet.getDataRange().getValues().slice(1);
  if (!data.length) return;

  // Group by month
  const months = {};
  data.forEach(row => {
    const monthYear = row[7];
    if (!monthYear) return;
    if (!months[monthYear]) months[monthYear] = { total: 0, welinton: 0, debora: 0, count: 0 };
    months[monthYear].total += Number(row[5]) || 0;
    months[monthYear].count += 1;
    if (row[2] === 'Welinton') months[monthYear].welinton += Number(row[5]) || 0;
    if (row[2] === 'Débora') months[monthYear].debora += Number(row[5]) || 0;
  });

  summarySheet.getRange(1, 1, 1, 5).setValues([['Mês/Ano', 'Total', 'Welinton', 'Débora', 'Lançamentos']]);
  summarySheet.getRange(1, 1, 1, 5).setFontWeight('bold');

  const rows = Object.entries(months)
    .sort((a, b) => {
      const [ma, ya] = a[0].split('/');
      const [mb, yb] = b[0].split('/');
      return Number(yb)*12 + Number(mb) - (Number(ya)*12 + Number(ma));
    })
    .map(([m, v]) => [m, v.total, v.welinton, v.debora, v.count]);

  if (rows.length) {
    summarySheet.getRange(2, 1, rows.length, 5).setValues(rows);
    summarySheet.getRange(2, 2, rows.length, 3).setNumberFormat('R$ #,##0.00');
  }
}
