const ExcelJS = require('exceljs');
const moment = require('moment');

class ExportController {
  static async exportAllData(req, res, next) {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'admin do sitema';
      workbook.created = new Date();

      const { startDate = moment().subtract(12, 'months').format('YYYY-MM-DD'),
              endDate = moment().format('YYYY-MM-DD') } = req.query;

      await Promise.all([
        this.addCouponDataSheet(workbook, startDate, endDate),
        this.addFinancialDataSheet(workbook, startDate, endDate),
        this.addSalesDataSheet(workbook, startDate, endDate),
        this.addDailyStatsSheet(workbook, startDate, endDate),
      ]);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=analise_${moment(startDate).format('YYYYMM')}_a_${moment(endDate).format('YYYYMM')}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async addCouponDataSheet(workbook, startDate, endDate) {
    const sheet = workbook.addWorksheet('Análise de Cupons');
    const months = this.generateMonthsArray(startDate, endDate);

    // Adiciona cabeçalho com período de análise
    sheet.addRow([`Período de Análise: ${moment(startDate).format('DD/MM/YYYY')} a ${moment(endDate).format('DD/MM/YYYY')}`]);
    sheet.addRow([]);

    // 1. Eficácia dos Cupons por Mês
    sheet.addRow(['EFICÁCIA DOS CUPONS POR MÊS']);
    this.addArrayToSheet(sheet, months.map(month => ({
      mês: month,
      cuponsUsados: Math.floor(Math.random() * 200) + 50,
      pedidos: Math.floor(Math.random() * 800) + 200,
      taxaUso: `${Math.floor(Math.random() * 20) + 10}%`,
      descontoMédio: `R$${(Math.random() * 20 + 10).toFixed(2)}`,
      receitaGerada: `R$${(Math.random() * 50000 + 10000).toFixed(2)}`
    })));

    // 2. Top Cupons no Período
    sheet.addRow([]);
    sheet.addRow(['TOP CUPONS NO PERÍODO']);
    this.addArrayToSheet(sheet, [
      { código: 'VERAO20', usos: 320, descontoTotal: 'R$6.400,00', receitaGerada: 'R$32.000,00', mesesAtivos: 'Jun-Ago' },
      { código: 'BLACKFRI30', usos: 290, descontoTotal: 'R$8.700,00', receitaGerada: 'R$29.000,00', mesesAtivos: 'Nov' },
      { código: 'ANIVERSARIO25', usos: 250, descontoTotal: 'R$6.250,00', receitaGerada: 'R$25.000,00', mesesAtivos: 'Mar-Mai' },
      { código: 'NATAL20', usos: 210, descontoTotal: 'R$4.200,00', receitaGerada: 'R$21.000,00', mesesAtivos: 'Dez' },
      { código: 'PROMO15', usos: 180, descontoTotal: 'R$2.700,00', receitaGerada: 'R$18.000,00', mesesAtivos: 'Jan-Fev, Set-Out' }
    ]);

    // 3. Estatísticas por Tipo de Cupom
    sheet.addRow([]);
    sheet.addRow(['ESTATÍSTICAS POR TIPO DE CUPOM']);
    this.addArrayToSheet(sheet, [
      { tipo: 'Primeira Compra', usos: 420, taxaConversão: '35%', ticketMédio: 'R$92,50', retençãoClientes: '42%' },
      { tipo: 'Fidelidade', usos: 380, taxaConversão: '45%', ticketMédio: 'R$115,20', retençãoClientes: '68%' },
      { tipo: 'Abandono Carrinho', usos: 290, taxaConversão: '28%', ticketMédio: 'R$88,75', retençãoClientes: '35%' },
      { tipo: 'Sazonal', usos: 510, taxaConversão: '22%', ticketMédio: 'R$105,30', retençãoClientes: '28%' }
    ]);

    // 4. Impacto no Ticket Médio por Mês
    sheet.addRow([]);
    sheet.addRow(['IMPACTO NO TICKET MÉDIO POR MÊS']);
    this.addArrayToSheet(sheet, months.map(month => ({
      mês: month,
      ticketSemCupom: `R$${(Math.random() * 50 + 70).toFixed(2)}`,
      ticketComCupom: `R$${(Math.random() * 50 + 100).toFixed(2)}`,
      diferença: `R$${(Math.random() * 30 + 15).toFixed(2)}`,
      aumentoPercentual: `${Math.floor(Math.random() * 20) + 15}%`
    })));
  }

  static async addFinancialDataSheet(workbook, startDate, endDate) {
    const sheet = workbook.addWorksheet('Análise Financeira');
    const months = this.generateMonthsArray(startDate, endDate);

    sheet.addRow([`Período de Análise: ${moment(startDate).format('DD/MM/YYYY')} a ${moment(endDate).format('DD/MM/YYYY')}`]);
    sheet.addRow([]);

    // 1. Receita Mensal Detalhada
    sheet.addRow(['RECEITA MENSAL DETALHADA']);
    this.addArrayToSheet(sheet, months.map(month => ({
      mês: month,
      receitaBruta: `R$${(Math.random() * 150000 + 50000).toFixed(2)}`,
      descontos: `R$${(Math.random() * 20000 + 5000).toFixed(2)}`,
      receitaLíquida: `R$${(Math.random() * 140000 + 45000).toFixed(2)}`,
      custos: `R$${(Math.random() * 70000 + 20000).toFixed(2)}`,
      lucro: `R$${(Math.random() * 80000 + 25000).toFixed(2)}`,
      margem: `${Math.floor(Math.random() * 15) + 20}%`
    })));

    // 2. Métodos de Pagamento por Mês
    sheet.addRow([]);
    sheet.addRow(['MÉTODOS DE PAGAMENTO POR MÊS']);
    const paymentMethods = ['Cartão de Crédito', 'Pix', 'Boleto', 'Transferência'];
    const paymentData = [];

    months.forEach(month => {
      paymentMethods.forEach(method => {
        paymentData.push({
          mês: month,
          método: method,
          transações: Math.floor(Math.random() * 500) + 100,
          valorTotal: `R$${(Math.random() * 50000 + 10000).toFixed(2)}`,
          percentual: `${Math.floor(Math.random() * 20) + 15}%`,
          ticketMédio: `R$${(Math.random() * 30 + 80).toFixed(2)}`
        });
      });
    });

    this.addArrayToSheet(sheet, paymentData);

    // 3. Taxa de Conversão Mensal
    sheet.addRow([]);
    sheet.addRow(['TAXA DE CONVERSÃO MENSA']);
    this.addArrayToSheet(sheet, months.map(month => ({
      mês: month,
      visitas: Math.floor(Math.random() * 10000) + 5000,
      carrinhos: Math.floor(Math.random() * 2000) + 500,
      pedidos: Math.floor(Math.random() * 500) + 100,
      conversãoVisitaPedido: `${Math.floor(Math.random() * 3) + 2}%`,
      conversãoCarrinhoPedido: `${Math.floor(Math.random() * 15) + 15}%`
    })));

    // 4. KPIs Financeiros
    sheet.addRow([]);
    sheet.addRow(['INDICADORES FINANCEIROS']);
    this.addObjectToSheet(sheet, {
      'Ticket Médio': {
        atual: 'R$88,37',
        'mês anterior': 'R$85,20',
        'ano anterior': 'R$82,15',
        variaçãoMensal: '+3,72%',
        variaçãoAnual: '+7,58%'
      },
      'Retorno sobre Descontos': {
        totalDescontos: 'R$45.000,00',
        receitaAdicional: 'R$180.000,00',
        ROI: '400%',
        novosClientes: 850
      },
      'Custos de Aquisição': {
        CAC: 'R$120,50',
        LTV: 'R$245,00',
        'Razão LTV/CAC': '2,03'
      }
    });
  }

  static async addSalesDataSheet(workbook, startDate, endDate) {
    const sheet = workbook.addWorksheet('Análise de Vendas');
    const months = this.generateMonthsArray(startDate, endDate);
    const categories = ['Eletrônicos', 'Moda', 'Casa', 'Beleza', 'Esportes'];

    sheet.addRow([`Período de Análise: ${moment(startDate).format('DD/MM/YYYY')} a ${moment(endDate).format('DD/MM/YYYY')}`]);
    sheet.addRow([]);

    // 1. Vendas por Categoria Mensal
    sheet.addRow(['VENDAS POR CATEGORIA MENSAIS']);
    const categoryData = [];

    months.forEach(month => {
      categories.forEach(category => {
        categoryData.push({
          mês: month,
          categoria: category,
          unidades: Math.floor(Math.random() * 500) + 100,
          receita: `R$${(Math.random() * 50000 + 10000).toFixed(2)}`,
          percentual: `${Math.floor(Math.random() * 10) + 15}%`
        });
      });
    });

    this.addArrayToSheet(sheet, categoryData);

    // 2. Top Produtos no Período
    sheet.addRow([]);
    sheet.addRow(['TOP PRODUTOS NO PERÍODO']);
    this.addArrayToSheet(sheet, [
      { produto: 'Smartphone X', categoria: 'Eletrônicos', unidades: 1250, receita: 'R$625.000,00', mesesTop: 'Jan, Mar, Jul' },
      { produto: 'Tênis Esportivo', categoria: 'Esportes', unidades: 980, receita: 'R$147.000,00', mesesTop: 'Fev, Abr, Jun' },
      { produto: 'Perfume Premium', categoria: 'Beleza', unidades: 850, receita: 'R$212.500,00', mesesTop: 'Mai, Nov, Dez' },
      { produto: 'Sofá Retrátil', categoria: 'Casa', unidades: 620, receita: 'R$186.000,00', mesesTop: 'Mar, Ago, Set' },
      { produto: 'Vestido Elegante', categoria: 'Moda', unidades: 580, receita: 'R$87.000,00', mesesTop: 'Abr, Out, Dez' }
    ]);

    // 3. Padrão de Vendas Diário
    sheet.addRow([]);
    sheet.addRow(['PADRÃO DE VENDAS DIÁRIO']);
    this.addArrayToSheet(sheet, [
      { hora: '8-9h', pedidos: 120, receita: 'R$10.200,00', pico: 'Normal' },
      { hora: '9-10h', pedidos: 180, receita: 'R$15.300,00', pico: 'Alto' },
      { hora: '12-13h', pedidos: 280, receita: 'R$23.800,00', pico: 'Máximo' },
      { hora: '15-16h', pedidos: 210, receita: 'R$17.850,00', pico: 'Normal' },
      { hora: '19-20h', pedidos: 190, receita: 'R$16.150,00', pico: 'Alto' }
    ]);

    // 4. Clientes por Mês
    sheet.addRow([]);
    sheet.addRow(['CLIENTES POR MÊS']);
    this.addArrayToSheet(sheet, months.map(month => ({
      mês: month,
      novosClientes: Math.floor(Math.random() * 150) + 50,
      clientesRecorrentes: Math.floor(Math.random() * 200) + 100,
      taxaRetenção: `${Math.floor(Math.random() * 20) + 30}%`,
      valorMédioRecorrente: `R$${(Math.random() * 50 + 80).toFixed(2)}`
    })));

    // 5. Eventos e Promoções
    sheet.addRow([]);
    sheet.addRow(['IMPACTO DE EVENTOS E PROMOÇÕES']);
    this.addArrayToSheet(sheet, [
      { evento: 'Black Friday', mês: 'Nov', aumentoVendas: '+320%', ticketMédio: 'R$145,20', novosClientes: 420 },
      { evento: 'Dia das Mães', mês: 'Mai', aumentoVendas: '+180%', ticketMédio: 'R$112,50', novosClientes: 210 },
      { evento: 'Natal', mês: 'Dez', aumentoVendas: '+250%', ticketMédio: 'R$128,75', novosClientes: 380 },
      { evento: 'Cyber Monday', mês: 'Nov', aumentoVendas: '+280%', ticketMédio: 'R$135,40', novosClientes: 350 }
    ]);
  }

  static async addDailyStatsSheet(workbook, startDate, endDate) {
    const sheet = workbook.addWorksheet('Estatísticas Diárias');
    const days = this.generateDaysArray(startDate, endDate);

    sheet.addRow([`Período de Análise: ${moment(startDate).format('DD/MM/YYYY')} a ${moment(endDate).format('DD/MM/YYYY')}`]);
    sheet.addRow([]);

    // 1. Estatísticas Diárias
    sheet.addRow(['ESTATÍSTICAS DIÁRIAS DETALHADAS']);
    this.addArrayToSheet(sheet, days.map(day => ({
      data: day,
      pedidos: Math.floor(Math.random() * 50) + 20,
      receita: `R$${(Math.random() * 10000 + 2000).toFixed(2)}`,
      ticketMédio: `R$${(Math.random() * 30 + 70).toFixed(2)}`,
      novosClientes: Math.floor(Math.random() * 10) + 5,
      cuponsUtilizados: Math.floor(Math.random() * 15) + 5
    })));

    // 2. Tendências Semanais
    sheet.addRow([]);
    sheet.addRow(['TENDÊNCIAS SEMANAIS']);
    this.addArrayToSheet(sheet, [
      { dia: 'Segunda', pedidosMédios: 85, receitaMédia: 'R$7.225,00', ticketMédio: 'R$85,00' },
      { dia: 'Terça', pedidosMédios: 92, receitaMédia: 'R$8.096,00', ticketMédio: 'R$88,00' },
      { dia: 'Quarta', pedidosMédios: 88, receitaMédia: 'R$7.744,00', ticketMédio: 'R$88,00' },
      { dia: 'Quinta', pedidosMédios: 95, receitaMédia: 'R$8.550,00', ticketMédio: 'R$90,00' },
      { dia: 'Sexta', pedidosMédios: 110, receitaMédia: 'R$10.450,00', ticketMédio: 'R$95,00' },
      { dia: 'Sábado', pedidosMédios: 105, receitaMédia: 'R$9.975,00', ticketMédio: 'R$95,00' },
      { dia: 'Domingo', pedidosMédios: 80, receitaMédia: 'R$7.200,00', ticketMédio: 'R$90,00' }
    ]);

    // 3. Comparativo Mês Atual vs Mês Anterior
    sheet.addRow([]);
    sheet.addRow(['COMPARATIVO MÊS ATUAL VS MÊS ANTERIOR']);
    this.addArrayToSheet(sheet, [
      { métrica: 'Pedidos', atual: 1420, anterior: 1350, variação: '+5,19%' },
      { métrica: 'Receita', atual: 'R$125.000,00', anterior: 'R$118.000,00', variação: '+5,93%' },
      { métrica: 'Ticket Médio', atual: 'R$88,03', anterior: 'R$87,41', variação: '+0,71%' },
      { métrica: 'Novos Clientes', atual: 380, anterior: 350, variação: '+8,57%' },
      { métrica: 'Cupons Utilizados', atual: 420, anterior: 390, variação: '+7,69%' }
    ]);
  }

  // Helper methods
  static generateMonthsArray(startDate, endDate) {
    const months = [];
    let current = moment(startDate);
    const end = moment(endDate);

    while (current <= end) {
      months.push(current.format('MMM/YYYY'));
      current.add(1, 'month');
    }

    return months;
  }

  static generateDaysArray(startDate, endDate) {
    const days = [];
    let current = moment(startDate);
    const end = moment(endDate);

    while (current <= end) {
      days.push(current.format('DD/MM/YYYY'));
      current.add(1, 'day');
    }

    return days;
  }

  static addArrayToSheet(sheet, data) {
    if (!Array.isArray(data)) return;

    // Headers
    const headers = Object.keys(data[0] || {});
    sheet.addRow(headers);

    // Data
    data.forEach(item => {
      const row = headers.map(header => item[header]);
      sheet.addRow(row);
    });
  }

  static addObjectToSheet(sheet, data) {
    if (!data || typeof data !== 'object') return;

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        sheet.addRow([key]);
        this.addArrayToSheet(sheet, value);
      } else if (typeof value === 'object') {
        sheet.addRow([key]);
        this.addObjectToSheet(sheet, value);
      } else {
        sheet.addRow([key, value]);
      }
    });
  }

  static addNestedObjectToSheet(sheet, data) {
    if (!data || typeof data !== 'object') return;

    for (const [key, value] of Object.entries(data)) {
      if (key === 'success') continue;

      if (typeof value === 'object' && value !== null) {
        sheet.addRow([key.toUpperCase()]);
        this.addObjectToSheet(sheet, value);
      } else {
        sheet.addRow([key, value]);
      }
    }
  }
}

module.exports = ExportController;
