

export const getBrands = async () => {
  const response = await fetch("https://api.fipe.cenarioconsulta.com.br/marcas/1");
  const { body } = await response.json();
  return body
}

export const getBrandVehicles = async ({ brandId }) => {
  const response = await fetch(`https://api.fipe.cenarioconsulta.com.br/modelos/${brandId}`);
  const { body } = await response.json();
  return body
}

export const getVehicleYears = async ({ vehicleId }) => {
  const response = await fetch(`https://api.fipe.cenarioconsulta.com.br/anos/${vehicleId}`);
  const { body } = await response.json();
  const maxYear = new Date().getFullYear() + 2 // remove crazy years
  return body.filter(y => parseInt(y.Ano) < maxYear)
}

export const searchMany = async ({
  numMonthsBack = 12 * 30,
  codigoMarca,
  codigoModelo,
  anoModelo,
}) => {

  const monthToIndex = { 'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6, 'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12, }

  const initialMonth = 350; // ??
  const promises = []

  for (let i=initialMonth; i > initialMonth - numMonthsBack; i--) {
    promises.push(search({
        mesRef: i,
        codigoMarca,
        codigoModelo,
        anoModelo,
    }));
  }

  // filter the problematic ones
  const jsonsPromises = (await Promise.allSettled(promises))
    .filter(p => p.status === 'fulfilled')
    .map(p => p.value)
    .map(p => p.json())

  return (await Promise.all(jsonsPromises))
    .filter(res => res.Valor) // remove empty ones
    .map((res) => {
      return {
        ...res,
        valor: Number(res.Valor.toString().replace(/[^0-9.-]+/g,"")) * 1000,
        ano: Number(res.MesReferencia.toString().replace(/[^0-9.-]+/g,"")),
        mes: res.MesReferencia.toString().split(' ')[0].trim(),
        mesIndex: monthToIndex[res.MesReferencia.toString().split(' ')[0].trim().slice(0, 3).toLowerCase()],
      }
    }).sort((a, b) => {
      if (a.ano !== b.ano) {
        return a.ano - b.ano
      }
      return a.mesIndex - b.mesIndex
    })
}

export const search = async ({
  mesRef,
  codigoMarca,
  codigoModelo,
  anoModelo,
}) => {
  return fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
      method: 'POST',
      body: new URLSearchParams({
        codigoTabelaReferencia: mesRef,
        codigoMarca: codigoMarca,
        codigoModelo: codigoModelo,
        codigoTipoVeiculo: '1',
        anoModelo: anoModelo,
        codigoTipoCombustivel: '1',
        tipoVeiculo: 'carro',
        tipoConsulta: 'tradicional'
      })
  })
}
