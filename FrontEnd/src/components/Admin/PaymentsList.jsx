import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3005/payment");
        setPayments(response.data);
      } catch (err) {
        setError("Erro ao carregar os pagamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
      failed: "bg-rose-100 text-rose-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getReservationStatusColor = (status) => {
    const colors = {
      booked: "bg-sky-100 text-sky-700",
      confirmed: "bg-emerald-100 text-emerald-700",
      completed: "bg-violet-100 text-violet-700",
      cancelled: "bg-rose-100 text-rose-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value, paymentMethod) => {
    const currency = paymentMethod === "Paypal" ? "USD" : "MZN";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const filteredPayments = useMemo(() => {
    return payments?.filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return (
          paymentDate >= start &&
          paymentDate <= new Date(end.setHours(23, 59, 59))
        );
      } else if (start) {
        return paymentDate >= start;
      } else if (end) {
        return paymentDate <= new Date(end.setHours(23, 59, 59));
      }
      return true;
    });
  }, [payments, startDate, endDate]);

  const convertCurrency = async (amount) => {
    console.log("Converting USD to MZN for:", amount);
    try {
      const response = await axios.post("http://localhost:3005/convert", {
        from: "USD",
        to: "MZN",
        amount: amount,
      });

      // Verificando a resposta para garantir que "convertedAmount" está presente
      if (response.data.success) {
        return response.data.convertedAmount || amount; // Retorna o valor convertido ou o original
      } else {
        console.error("Conversão falhou", response.data);
        return amount; // Retorna o valor original caso algo dê errado
      }
    } catch (error) {
      console.error("Erro na conversão de moeda:", error);
      return amount; // Retorna o valor original caso a conversão falhe
    }
  };

  useEffect(() => {
    const calculateTotalAmount = async () => {
      let total = 0;
  
      // Use filteredPayments em vez de payments
      for (const payment of filteredPayments) {
        let amount = payment.amount;
        if (payment.payment_method !== "M-Pesa") {
          amount = await convertCurrency(amount);
        }
        total += amount * 0.1; // Aplica o cálculo final
      }
  
      setTotalAmount(total);
    };
  
    if (filteredPayments.length > 0) {
      calculateTotalAmount();
    } else {
      setTotalAmount(0); // Caso não haja pagamentos filtrados
    }
  }, [filteredPayments]); // Depende dos filteredPayments para recalcular o total
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border  border-gray-100 mt-6">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Lista de Pagamentos
          </h2>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
            <span className="text-sm font-medium text-gray-600 mr-2">
              Total:
            </span>
            <span className="text-lg font-bold text-gray-800">
              {formatCurrency(totalAmount, "MZN")}{" "}
              {/* Adjust currency here if necessary */}
            </span>
          </div>
        </div>

        {/* Date Filters */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex-shrink-0"
          >
            Limpar Filtros
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Pagamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Reserva
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Babá
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments?.map((payment) => (
                <tr
                  key={payment.payment_id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.payment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      {payment.client?.first_name} {payment.client?.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {formatCurrency(payment.amount, payment.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.payment_method || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getReservationStatusColor(
                        payment.reservation?.status
                      )}`}
                    >
                      {payment.reservation?.status || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {payment.nanny?.first_name} {payment.nanny?.last_name}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
