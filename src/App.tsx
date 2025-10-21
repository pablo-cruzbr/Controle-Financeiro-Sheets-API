import React, { useState, useEffect } from "react";
import "./App.css";
import logo from './assets/logoexcel.svg';
import axios from "axios";

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
  const [refresh, setRefresh] = useState(false); // usado para forçar atualização

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await axios.get<Lancamento[]>(
        "https://api.sheetbest.com/sheets/fbfcb510-6471-418f-beb3-7c6aeb4cd4e6"
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
        "https://api.sheetbest.com/sheets/fbfcb510-6471-418f-beb3-7c6aeb4cd4e6",
        novoLancamento,
        {
          headers: {
            "X-Api-Key": "R4R615rQ!fvkWK9N$EM2-Rg_1fgwvrlS@dFcyIJT6%66-o@FXu3xCEdQTU#lX$l8"
          }
        }
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

          <button type="submit" className="btn-submit">
            Adicionar Despesa
          </button>
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
