import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Lancamento {
  compra: string;
  categoria: string;
  data: string;
  custo: string;
}

interface Props {
  data: Lancamento[];
}

const RechartsComponent: React.FC<Props> = ({ data }) => {
  const saldoTotal = data.reduce((acc, item) => {
    const valor = parseFloat(item.custo) || 0;
    const cat = item.categoria.toLowerCase();
    if (cat === "receita" || cat === "salário" || cat === "entrada") {
      return acc + valor;
    }
    return acc - valor;
  }, 0);

  const dadosGrafico = data.reduce((acc: any[], item) => {
    const existente = acc.find(x => x.name === item.categoria);
    const valor = parseFloat(item.custo) || 0;
    
    if (existente) {
      existente.value += valor;
    } else {
      acc.push({ name: item.categoria, value: valor });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="dashboard-section">
      <div className="balance-card">
        <h3>Saldo Atual</h3>
        <h2 style={{ color: saldoTotal >= 0 ? '#27ae60' : '#e74c3c' }}>
          R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="chart-container" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dadosGrafico}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dadosGrafico.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RechartsComponent;