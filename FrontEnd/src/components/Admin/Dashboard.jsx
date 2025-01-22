import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Activity, UserCheck, Wallet } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBabas: 0,
    totalClientes: 0,
    reservasAtivas: 0,
    rendimentoMensal: "R$ 0,00",
    crescimentoMensal: "+0%",
    satisfacaoClientes: "0%",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza a requisição para obter os dados
        const response = await axios.get("http://localhost:3005/count-users");
        const responseData = await axios.get(
          "http://localhost:3005/reservations/getAll/reservations"
        );

        const res = await axios.get("http://localhost:3005/Payment/payments/total-completed-month");

        const data = response.data;
        const reservationsData = responseData.data;
        const paymentData = res.data;

        console.log(paymentData)

    
        // Atualiza o estado com os dados recebidos
        setStats({
          totalBabas: data.nannies || 0,
          totalClientes: data.clients || 0,
          reservasAtivas: reservationsData.count || 0,
          rendimentoMensal: paymentData.totalAmount
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MZN' }).format(paymentData.totalAmount)
            : "$0.00", // Caso o valor não exista, exibe $0.00
          crescimentoMensal: data.crescimentoMensal || "+0%",
          satisfacaoClientes: data.satisfacaoClientes || "0%",
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    // Chama a função para buscar os dados
    fetchData();
  }, []); // O array vazio faz com que a requisição ocorra apenas uma vez quando o componente for montado

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 ">
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total de Babás</p>
            <p className="text-3xl font-bold text-blue-700">
              {stats.totalBabas}
            </p>
          </div>
          <div className="bg-blue-200 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-700" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">
              Total de Clientes
            </p>
            <p className="text-3xl font-bold text-green-700">
              {stats.totalClientes}
            </p>
          </div>
          <div className="bg-green-200 p-3 rounded-full">
            <UserCheck className="h-6 w-6 text-green-700" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 font-medium">
              Reservas Ativas
            </p>
            <p className="text-3xl font-bold text-yellow-700">
              {stats.reservasAtivas}
            </p>
          </div>
          <div className="bg-yellow-200 p-3 rounded-full">
            <Activity className="h-6 w-6 text-yellow-700" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">
              Rendimento Mensal
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {stats.rendimentoMensal}
            </p>
          </div>
          <div className="bg-purple-200 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-purple-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
