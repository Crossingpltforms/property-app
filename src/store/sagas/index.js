import { all } from 'redux-saga/effects'

import { editPersonInfoActionWatcher } from './Edit-Person-Info'

export default function * root () {
  yield all([editPersonInfoActionWatcher()])
}
