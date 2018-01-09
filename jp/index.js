// TODO: Shouldn't have to import stuff manually here, should just load all .md
// files from the relevant locations... probably need to do that via webpack.

// lesson 1
import l1_overview from './1/00-overview.md'

// lesson2
import l2_overview from './2/00-overview.md'

// chapterList is an ordered array of chapters. The order represents the order of the chapters.
// chapter index will be 1-based and not zero-based. First chapter is 1

export default {
  1: [
    l1_overview,
  ],
  2: [
    l2_overview,
  ],
}
