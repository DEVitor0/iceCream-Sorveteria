// data/index.js
export default function getOrderData(orders = []) {
  const rows = orders.map((order, index) => {
    const orderId = order._id
      ? `#${order._id.toString().substring(18, 24).toUpperCase()}`
      : `#${index.toString().padStart(6, '0')}`;

    const customerName = order.userId?.name || 'Cliente não identificado';
    const totalAmount = order.totalAmount
      ? `R$ ${order.totalAmount.toFixed(2)}`
      : 'R$ 0,00';

    const statusInfo = {
      value:
        order.status === 'completed'
          ? 'Concluído'
          : order.status === 'pending'
          ? 'Pendente'
          : order.status === 'cancelled'
          ? 'Cancelado'
          : order.status === 'processing'
          ? 'Processando'
          : order.status || 'N/A',
      color:
        order.status === 'completed'
          ? 'success'
          : order.status === 'pending'
          ? 'warning'
          : order.status === 'cancelled'
          ? 'error'
          : 'text',
    };

    const timeText = order.createdAt
      ? new Date(order.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A';

    return {
      Pedido: orderId,
      Cliente: customerName,
      Valor: totalAmount,
      Status: statusInfo, // Agora é um objeto com value e color
      Horário: timeText,
      hasBorder: true,
    };
  });

  const columns = [
    { name: 'Pedido', align: 'left' },
    { name: 'Cliente', align: 'left' },
    { name: 'Valor', align: 'center' },
    { name: 'Status', align: 'center' },
    { name: 'Horário', align: 'center' },
  ];

  return { columns, rows };
}
