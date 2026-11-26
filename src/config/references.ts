/** Transcribed from the supplied Altay Rustamov portfolio, pp. 7–28.
 * Original numbering is retained, including the two Elz entries (11 and 15).
 * PV values are reported as in the source, not reinterpreted as inverter ratings.
 */
export interface ReferenceProject {
  id: number
  street: string
  city: string
  system: string
  pv?: number
  storage?: number
  pages: number[]
  category: 'Photovoltaik' | 'PV & Wärmepumpe' | 'Wärme & Kälte' | 'Off-Grid'
}
type Row = [number, string, string, string, number | null, number | null, number[], ReferenceProject['category']]
const rows: Row[] = [
 [1,'Golden Tulip Parkhotel · Silcherstraße','Neu-Ulm','Daikin-System für Heizung und Kühlung',null,null,[14],'Wärme & Kälte'],
 [2,'Einfamilienhaus','Goradil, Aserbaidschan','Photovoltaikanlage mit Speicher',12,10,[],'Photovoltaik'],
 [3,'An der Kirche','Troisdorf','Huawei',8,10,[],'Photovoltaik'],
 [4,'Finkenweg','Wesseling','Einfamilienhaus · GoodWe',15,10,[10],'Photovoltaik'],
 [5,'Methweg','Köln','10 Wohnungen · Heizzentrale mit WOLF-Luft-Wasser-Wärmepumpe',null,null,[],'Wärme & Kälte'],
 [6,'Am Engelshof','Köln','10 Wohnungen · Sungrow und Stiebel-Eltron-Luft-Wasser-Wärmepumpen in Kaskade',16,10,[9],'PV & Wärmepumpe'],
 [7,'Am Thelenhof','Leverkusen','Einfamilienhaus · SolaX',16,10,[11],'Photovoltaik'],
 [8,'Vogtsbell','Frechen','Einfamilienhaus · Fronius',10,10,[],'Photovoltaik'],
 [9,'Langflecht','Oestrich-Winkel','Huawei',6,5,[13],'Photovoltaik'],
 [10,'Narzissenstraße','Nordhorn','Einfamilienhaus · Fronius mit BYD-Speicher',10,7.5,[],'Photovoltaik'],
 [11,'Am Reiserberg','Elz','Einfamilienhaus · Fronius mit BYD-Speicher',10,7.5,[17],'Photovoltaik'],
 [12,'Frankfurter Straße','Köln','Einfamilienhaus · Huawei',18,20,[],'Photovoltaik'],
 [13,'Schellersberg','Bad Camberg','Einfamilienhaus · Huawei',8,10,[20],'Photovoltaik'],
 [14,'Johannisbrunnenstraße','Walluf','Huawei',6,5,[21],'Photovoltaik'],
 [15,'Am Reiserberg','Elz','Weiterer Portfolioeintrag · Fronius mit BYD-Speicher',10,7.5,[19],'Photovoltaik'],
 [16,'Kalk-Mülheimer Straße','Köln','Mehrfamilienhaus · Heizung, Wasserversorgung, Pollmann-Luft-Wasser-Wärmepumpe und Huawei-PV',40,20,[22],'PV & Wärmepumpe'],
 [17,'Ringweg','Friedberg','Huawei',16,10,[],'Photovoltaik'],
 [18,'Germaniastraße','Köln','GoodWe · Photovoltaik auf einer Überdachung',30,10,[16],'Photovoltaik'],
 [19,'Lanaer Straße','Idstein','SMA',10,10,[],'Photovoltaik'],
 [20,'Hirschbacher Straße','Karben','Huawei',10,10,[24],'Photovoltaik'],
 [21,'Tiefenbachwiesen','Bad Homburg','Huawei',8,10,[25],'Photovoltaik'],
 [22,'Emser Straße','Bad Schwalbach','Huawei',12,10,[27],'Photovoltaik'],
 [23,'Hölderlinstraße','Limburg','Huawei',8,10,[28],'Photovoltaik'],
 [24,'Bergstraße','Eppstein','Fronius mit BYD-Speicher',8,10,[],'Photovoltaik'],
 [25,'Wernborner Straße','Neu-Anspach','SMA mit BYD-Speicher',6,7.5,[],'Photovoltaik'],
 [26,'An der Steinkaut','Friedrichsdorf','Fronius mit BYD-Speicher',6,5,[],'Photovoltaik'],
 [27,'Weinheimer Straße','Köln','SolaX und Stiebel-Eltron-LWZ-Luft-Wasser-Wärmepumpe',10,10,[18],'PV & Wärmepumpe'],
 [28,'Gerbirgis-Weg','Köln','Deye',5,5,[],'Photovoltaik'],
 [29,'Mobilfunk-Basisstation','Karabach, Aserbaidschan','Projektbeteiligung an einer netzunabhängigen Energieversorgung · PV-Projektskizze mit Victron',null,null,[],'Off-Grid'],
 [30,'Urdenbacher Straße','Köln','SolaX',5,10,[],'Photovoltaik'],
 [31,'Berliner Straße','Köln','30 Wohnungen · Huawei und Dimplex-Luft-Wasser-Wärmepumpe',30,40,[23],'PV & Wärmepumpe'],
 [32,'Weberstraße','Köln','Huawei',10,10,[],'Photovoltaik'],
 [33,'Hohlgasse','Köln','SolaX',10,10,[],'Photovoltaik'],
 [34,'Bielertstraße','Leverkusen','Huawei',5,5,[],'Photovoltaik'],
 [35,'Helene-Wessel-Straße','Köln','Sungrow',10,10,[],'Photovoltaik'],
 [36,'Weilerstraße','Köln','Sungrow',16,20,[],'Photovoltaik'],
 [37,'Frankfurter Straße','Köln','33 Wohnungen · Heizung, Wasserversorgung und Dimplex-Luft-Wasser-Wärmepumpe mit PV und Speicher',40,20,[26],'PV & Wärmepumpe'],
 [38,'Gerhart-Hauptmann-Straße','Rösrath','Huawei',10,10,[],'Photovoltaik'],
 [39,'Bensberger Straße','Bergisch Gladbach','GoodWe und Stiebel-Eltron-Luft-Wasser-Wärmepumpe',10,10,[],'PV & Wärmepumpe'],
 [40,'Espenweg','Leverkusen','Huawei',10,10,[],'Photovoltaik'],
 [41,'Linder Weg','Köln','Huawei',10,10,[],'Photovoltaik'],
 [42,'Longericher Hauptstraße','Köln','Deye',10,10,[],'Photovoltaik'],
 [43,'Gezelinallee','Leverkusen','Huawei und Dimplex-Luft-Wasser-Wärmepumpe',8,10,[],'PV & Wärmepumpe'],
 [44,'Beienburger Straße','Rösrath','Mehrfamilienhaus · Stiebel-Eltron-Erdwärmepumpe und Erdwärmebohrung',null,null,[15],'Wärme & Kälte'],
 [45,'Neusser Straße','Köln','Sungrow',12,null,[],'Photovoltaik'],
 [46,'Aachener Straße','Köln','Sungrow',6,10,[],'Photovoltaik'],
 [47,'Zehntstraße','Köln','Huawei',10,10,[],'Photovoltaik'],
 [48,'Weizenkamp','Leverkusen','SolaX',10,10,[],'Photovoltaik'],
 [49,'Fliederweg','Köln','Huawei und Vaillant-Luft-Wasser-Wärmepumpe',10,10,[],'PV & Wärmepumpe'],
 [50,'Pastor-Böhm-Straße','Troisdorf-Sieglar','Huawei und Novelan-Luft-Wasser-Wärmepumpe',10,10,[],'PV & Wärmepumpe'],
 [51,'Hotel Villa Sofia · Riehler Straße','Köln','32 Zimmer · Danfoss-Zentralheizung und Wärmepumpenlösung',null,null,[12],'Wärme & Kälte'],
]
export const referenceProjects: ReferenceProject[] = rows.map(([id,street,city,system,pv,storage,pages,category]) => ({id,street,city,system,pv:pv ?? undefined,storage:storage ?? undefined,pages,category}))
export const portfolioUrl = '/documents/altay-rustamov-portfolio.pdf'
