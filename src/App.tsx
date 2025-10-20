import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    compra: "",
    categoria: "",
    data: "",
    custo: "",
  });

  const [historico, setHistorico] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((val) => val === "")) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const novoLancamento = { ...formData, id: Date.now() };
    setHistorico([...historico, novoLancamento]);

    setFormData({
      compra: "",
      categoria: "",
      data: "",
      custo: "",
    });
  };

  const total = historico.reduce((acc, item) => acc + parseFloat(item.custo), 0);

  return (
    <div className="app-container">
      <div className="finance-card">
        <h1 className="title">💰 TESTE Sistema de Controle Financeiro com Sheets API wwww</h1>

        <form onSubmit={handleSubmit} className="finance-form">
          <div className="form-group">
            <label>Descrição da Compra</label>
            <input
              name="compra"
              placeholder="Ex: Supermercado"
              value={formData.compra}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input
              name="categoria"
              placeholder="Ex: Alimentação"
              value={formData.categoria}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              name="custo"
              placeholder="Ex: 89.90"
              value={formData.custo}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-submit">
            Adicionar Despesa
          </button>
        </form>

        <h2 className="subtitle">
          Histórico de Lançamentos ({historico.length})
        </h2>

        {historico.length === 0 ? (
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
                {historico.map((item) => (
                  <tr key={item.id}>
                    <td>{item.compra}</td>
                    <td>{item.categoria}</td>
                    <td>{item.data}</td>
                    <td className="text-right">
                      R$ {parseFloat(item.custo).toFixed(2)}
                    </td>
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
