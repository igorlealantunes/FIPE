import { useEffect, useState } from "react";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Icon } from '@mui/material';

const PriceEvolution = ({ prices }) => {

    const [sortedPrices, setSortedPrices] = useState([]);
    const [priceDiff, setPriceDiff] = useState(0);
    const [pricePercDiff, setPricePercDiff] = useState(0);

    useEffect(() => {
      setSortedPrices(prices.sort((a, b) => {
        if (a.ano !== b.ano) {
          return a.ano - b.ano
        }
        return a.mesIndex - b.mesIndex
      }))

      const first = prices[0];
      const last = prices[prices.length - 1];
      const diff = last.valor - first.valor;
      const diffPercentage = (diff / first.valor) * 100;

      setPriceDiff(diff);
      setPricePercDiff(diffPercentage);
    }, [prices]);

    return parseInt(priceDiff) === 0 ? '' : (
      <section className="flex justify-center py-1 min-w-fit">
        <div className="border px-2">
          <div className="text-xs flex justify-center items-center">
            <span className="pr-2">{priceDiff > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />} </span>
            <p>R${priceDiff.toFixed(2)} ({pricePercDiff.toFixed(2)}%) in the last <b>{sortedPrices.length} months</b></p>
          </div>
        </div>
      </section>
    );
}

export default PriceEvolution;
