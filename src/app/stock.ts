export interface stock {
  symbol: string;
  fs: any;

  name:{
    th: string;
    en: string;
  };

  contact:{
    address:{
      th: string;
      en: string;
    };
    zip: string;
    tel: string;
    fax: string;
    web: string;
  };

  establishment_date: string;
  listing_date: string;
  first_trading_date: string;

  status:{
    delisted_date: string;
    listing: string;
  };

  market: string;
  industry: string;
  sector: string;

  business:{
    th: string;
    en: string;
  };

  shares:{
    authorized: number;
    paidup: number;
    listed: number;
  }

  cg_score: number;
  ipo_price: number;
  par: number;
  fiscal_year_end_date: string;
  currency: string;

}
