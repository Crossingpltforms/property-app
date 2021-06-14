import { Color, Matrics, Fonts } from '../../common/styles'
export default (styles = {
  header: {
    flex: 1,
    backgroundColor: Color.primary
  },
  headerview: {
    flexDirection: 'row',
    paddingLeft: Matrics.ScaleValue(25)
  },
  imageBgView: { justifyContent: 'flex-start' },
  bgImageStyle: { justifyContent: 'center' },
  titleMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Matrics.ScaleValue(15)
  },
  welcomeText: {
    fontSize: Matrics.ScaleValue(25),
    color: '#000',
    fontFamily: Fonts.type.OpenSansBold
  },
  viewLoginOptions: {
    // flexDirection: "row",
    justifyContent: 'center',
    paddingTop: 30,
    alignItems: 'center'
  },
  viewBytap: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 40,
    width: Matrics.screenWidth - Matrics.ScaleValue(50),
    alignSelf: 'center'
  },
  bytapText: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  },
  safeView: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  btn2Styles: {
    backgroundColor: Color.primary,
    height: Matrics.ScaleValue(45),
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(5),
    marginTop: Matrics.ScaleValue(10)
  }
})
module.exports = styles
