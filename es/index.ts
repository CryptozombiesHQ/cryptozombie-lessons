// TODO: Shouldn't have to import stuff manually here, should just load all .md
// files from the relevant locations... probably need to do that via webpack.

// lesson 1
import l1_overview from './1/00-overview.md'
import datatypes from './1/datatypes.md'
import contracts from './1/contracts.md'
import math from './1/math.md'
import lessonoverview from './1/lessonoverview.md'
import structs from './1/structs.md'
import arrays from './1/arrays.md'
import functions from './1/functions.md'
import arraysstructs2 from './1/arraysstructs2.md'
import functions2 from './1/functions2.md'
import functions3 from './1/functions3.md'
import keccak256 from './1/keccak256.md'
import puttingittogether from './1/puttingittogether.md'
import events from './1/events.md'
import web3js from './1/web3js.md'
import lessoncomplete from './1/lessoncomplete.md'

// lesson2
import l2_overview from './2/00-overview.md'
import overview from './2/1-overview.md'
import mappings from './2/2-mappings.md'
import msgsender from './2/3-msgsender.md'
import l2_require from './2/4-require.md'
import inheritance from './2/5-inheritance.md'
import importfiles from './2/6-importfiles.md'
import storage from './2/7-storage.md'
import feedandmultiply2 from './2/8-feedandmultiply2.md'
import internalfunctions from './2/9-internalfunctions.md'
import interactingcontracts from './2/10-interactingcontracts.md'
import interactingcontracts2 from './2/11-interactingcontracts2.md'
import multiplereturns from './2/12-multiplereturns.md'
import kittygenes from './2/13-kittygenes.md'
import wrappingitup from './2/14-wrappingitup.md'
import lesson2complete from './2/15-lessoncomplete.md'

// lesson3
import l3_overview from './3/00-overview.md'
import l3_ch1 from './3/01-externaldependencies.md'
import l3_ch2 from './3/02-ownable.md'
import l3_ch3 from './3/03-onlyowner.md'
import l3_ch4 from './3/04-gas.md'
import l3_ch5 from './3/05-timeunits.md'
import l3_ch6 from './3/06-zombiecooldowns.md'
import l3_ch7 from './3/07-zombiecooldowns2.md'
import l3_ch8 from './3/08-functionmodifiers.md'
import l3_ch9 from './3/09-zombiemodifiers.md'
import l3_ch10 from './3/10-savinggasview.md'
import l3_ch11 from './3/11-savinggasstorage.md'
import l3_ch12 from './3/12-forloops.md'
import l3_ch13 from './3/13-wrappingitup.md'
import l3_complete from './3/14-lessoncomplete.md'

// lesson4
import l4_overview from './4/00-overview.md'
import l4_payable from './4/payable.md'
import l4_withdraw from './4/withdraw.md'
import l4_ch1 from './4/battle-01.md'
import l4_ch2 from './4/battle-02.md'
import l4_ch3 from './4/battle-03.md'
import l4_ch4 from './4/battle-04.md'
import l4_ch5 from './4/battle-05.md'
import l4_ch6 from './4/battle-06.md'
import l4_ch7 from './4/battle-07.md'
import l4_ch8 from './4/battle-08.md'
import l4_ch9 from './4/battle-09.md'
import l4_ch10 from './4/wrappingitup.md'
import l4_complete from './4/lessoncomplete.md'

// lesson5
import l5_overview from './5/00-overview.md'
import l5_ch1 from './5/01-erc721-1.md'
import l5_ch2 from './5/02-erc721-2.md'
import l5_ch3 from './5/03-erc721-3.md'
import l5_ch4 from './5/04-erc721-4.md'
import l5_ch5 from './5/05-erc721-5.md'
import l5_ch6 from './5/06-erc721-6.md'
import l5_ch7 from './5/07-erc721-7.md'
import l5_ch8 from './5/08-erc721-8.md'
import l5_ch9 from './5/09-safemath-1.md'
import l5_ch10 from './5/10-safemath-2.md'
import l5_ch11 from './5/11-safemath-3.md'
import l5_ch12 from './5/12-safemath-4.md'
import l5_ch13 from './5/13-comments.md'
import l5_ch14 from './5/14-wrappingitup.md'
import l5_complete from './5/15-lessoncomplete.md'

// lesson6
import l6_overview from './6/00-overview.md'
import l6_ch1 from './6/01.md'
import l6_ch2 from './6/02.md'
import l6_ch3 from './6/03.md'
import l6_ch4 from './6/04.md'
import l6_ch5 from './6/05.md'
import l6_ch6 from './6/06.md'
import l6_ch7 from './6/07.md'
import l6_ch8 from './6/08.md'
import l6_ch9 from './6/09.md'
import l6_ch10 from './6/10-wrappingitup.md'
import l6_complete from './6/lessoncomplete.md'


// chapterList is an ordered array of chapters. The order represents the order of the chapters.
// chapter index will be 1-based and not zero-based. First chapter is 1

export default {
  1: [
    l1_overview,
    lessonoverview,
    contracts,
    datatypes,
    math,
    structs,
    arrays,
    functions,
    arraysstructs2,
    functions2,
    functions3,
    keccak256,
    puttingittogether,
    events,
    web3js,
    lessoncomplete
  ],
  2: [
    l2_overview,
    overview,
    mappings,
    msgsender,
    l2_require,
    inheritance,
    importfiles,
    storage,
    feedandmultiply2,
    internalfunctions,
    interactingcontracts,
    interactingcontracts2,
    multiplereturns,
    kittygenes,
    wrappingitup,
    lesson2complete
  ],
  3: [
    l3_overview,
    l3_ch1,
    l3_ch2,
    l3_ch3,
    l3_ch4,
    l3_ch5,
    l3_ch6,
    l3_ch7,
    l3_ch8,
    l3_ch9,
    l3_ch10,
    l3_ch11,
    l3_ch12,
    l3_ch13,
    l3_complete
  ],
  4: [
    l4_overview,
    l4_payable,
    l4_withdraw,
    l4_ch1,
    l4_ch2,
    l4_ch3,
    l4_ch4,
    l4_ch5,
    l4_ch6,
    l4_ch7,
    l4_ch8,
    l4_ch9,
    l4_ch10,
    l4_complete
  ],
  5: [
    l5_overview,
    l5_ch1,
    l5_ch2,
    l5_ch3,
    l5_ch4,
    l5_ch5,
    l5_ch6,
    l5_ch7,
    l5_ch8,
    l5_ch9,
    l5_ch10,
    l5_ch11,
    l5_ch12,
    l5_ch13,
    l5_ch14,
    l5_complete
  ],
  6: [
    l6_overview,
    l6_ch1,
    l6_ch2,
    l6_ch3,
    l6_ch4,
    l6_ch5,
    l6_ch6,
    l6_ch7,
    l6_ch8,
    l6_ch9,
    l6_ch10,
    l6_complete,
  ],
}
