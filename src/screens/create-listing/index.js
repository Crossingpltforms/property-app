import { connect } from 'react-redux'
import component from './component'
import { bindActionCreators } from 'redux'
function mapStateToProps ({}) {
  return {}
}
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(component)
