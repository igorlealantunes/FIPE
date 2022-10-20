const MonthPrice = ({ price }) => {
    return (
      <section className="flex justify-center">
        <div className="border px-2">
          <div className="text-xs underline">
            <p>{price.Modelo} ({price.AnoModelo})</p>
          </div>
          <span className="capitalize">{price.mes}/{price.ano}: <b>{price.Valor}</b></span>
        </div>
      </section>
    );
}

export default MonthPrice;
