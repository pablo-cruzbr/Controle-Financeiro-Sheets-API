import React, { useState, useEffect } from "react";
import "./App.css";
import logo from './assets/logoexcel.svg';
import axios from "axios";
import RechartsComponent from "./components/RechartsComponent";

interface Lancamento {
  compra: string;
  categoria: string;
  data: string;
  custo: string;
}

const App = () => {
  const [compra, setCompra] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [custo, setCusto] = useState("");
  const [APIdata, setAPIdata] = useState<Lancamento[]>([]);
  const [refresh, setRefresh] = useState(false); 
  
  const fetchData = async () => {
  try {
    const response = await axios.get<Lancamento[]>(
      "https://api.steinhq.com/v1/storages/69acdb9aaffba40a625b5380/Sheet1"
    );
    setAPIdata(response.data);
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
  }
};

useEffect(() => {
  fetchData();
}, [refresh]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!compra || !categoria || !data || !custo) {
    alert("Preencha todos os campos!");
    return;
  }

  const novoLancamento: Lancamento = { compra, categoria, data, custo };

  try {
    await axios.post(
      "https://api.steinhq.com/v1/storages/69acdb9aaffba40a625b5380/Sheet1",
      [novoLancamento] 
    );

    setCompra("");
    setCategoria("");
    setData("");
    setCusto("");

    setRefresh(prev => !prev); 
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
};

  const total = APIdata.reduce((acc, item) => acc + parseFloat(item.custo), 0);

  return (
    <div className="app-container">
      <div className="finance-card">
        <img src={logo} alt="Logo do sistema" className="logo" />

        <h1 className="title">Sistema de Controle Financeiro</h1>
        <h1 className="title2">Integração com Google Planilhas</h1>
        
        <form onSubmit={handleSubmit} className="finance-form">
          <div className="form-group">
            <label>Descrição da Compra</label>
            <input
              name="compra"
              placeholder="Ex: Supermercado"
              value={compra}
              onChange={(e) => setCompra(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input
              name="categoria"
              placeholder="Ex: Alimentação"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              name="custo"
              placeholder="Ex: 89.90"
              value={custo}
              onChange={(e) => setCusto(e.target.value)}
            />
          </div>

        <div className="inline">

          <button type="submit" className="btn-submit">
            Adicionar Despesa
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/10D3DWKL0qc4vkevLTP-rRSznEUzBsywUkHuUZCK8gVw/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="btn-submit">
              Visualizar Planilha
            </button>
          </a>

        </div>
         <RechartsComponent data={APIdata} />

        </form>

        <h2 className="subtitle">
          Histórico de Lançamentos ({APIdata.length})
        </h2>

        {APIdata.length === 0 ? (
          <p className="empty-text">Nenhuma despesa registrada ainda.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Compra</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th className="text-right">Custo</th>
                </tr>
              </thead>
              <tbody>
                {APIdata.map((item, index) => (
                  <tr key={index}>
                    <td>{item.compra}</td>
                    <td>{item.categoria}</td>
                    <td>{item.data}</td>
                    <td className="text-right">R$ {parseFloat(item.custo).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right total-label">
                    Total:
                  </td>
                  <td className="text-right total-value">
                    R$ {total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
