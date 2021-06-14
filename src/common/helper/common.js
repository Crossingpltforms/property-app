import AsyncStorage from '@react-native-community/async-storage';
import * as _ from 'lodash';

import { roomTypesConst, holidayDisableDatesObj } from '../constants';

export const getRoomTypeLabel = (roomTypeValue) => {
  let roomType = '';

  if (roomTypeValue && roomTypeValue !== '') {
    let typeData = roomTypesConst.find(
      (type) => type.value === roomTypeValue.toLowerCase()
    );
    if (typeData) {
      roomType = typeData.label;
    }
  }

  return roomType;
};

export const displayZeroDeposit = (price, type) => {
  var roomType = false;

  if (type === 'room') {
    if (price > 500 && price < 1500) {
      roomType = true;
    }
  } else {
    if (price > 500 && price < 5000) {
      roomType = true;
    }
  }

  return roomType;
};

export const priceFormat = (amount) => {
  return Number(amount)
    .toFixed(0)
    .replace(/\d(?=(\d{3})+$)/g, '$&,');
};

export const getUserInfo = async () => {
  let user = null;
  try {
    user = (await AsyncStorage.getItem('accountInfo')) || null;
  } catch (error) {
    // Error retrieving data
  }
  return user;
};

export const compareVersions = (liveVersion, newVersion) => {
  var liveAppVersion = liveVersion.split('.');
  var newAppVersion = newVersion.split('.');
  if (liveAppVersion != '' && newAppVersion != '' && newAppVersion.length > 0) {
    if (liveAppVersion[0] > newAppVersion[0]) return true;
    else if (liveAppVersion[1] > newAppVersion[1]) return true;
    else if (
      liveAppVersion[1] == newAppVersion[1] &&
      liveAppVersion[2] > newAppVersion[2]
    )
      return true;
    else return false;
  }
  return false;
};

export const getNextTenWorkingDaysCount = (startDate) => {
  let dDate1 = new Date(startDate);
  let dDate2 = new Date();
  dDate2.setDate(dDate1.getDate() + 20); //just of taking more days to check for weekends and PH
  let workingDays = 0; // initial values
  let holidays = 0; // initial values

  while (dDate1 < dDate2) {
    if (
      dDate1.getDay() === 0 ||
      dDate1.getDay() === 6 ||
      !_.isEmpty(
        holidayDisableDatesObj[
          `${dDate1.getFullYear()}-${dDate1.getMonth() + 1}-${dDate1.getDate()}`
        ]
      )
    ) {
      ++holidays;
    } else {
      ++workingDays;
      if (workingDays === 10) {
        // update total days as per requirement
        break;
      }
    }
    dDate1.setDate(dDate1.getDate() + 1);
  }

  return workingDays + holidays; // total days to include show 8 enabled/working days
};
export const nicNumberFormat = (number) => {
  // format NIC number to format xxxxxx-xx-xxxx
  number = number.split('-').join('');
  const firstSix = number.slice(0, 6);
  const secondTwo = number.slice(6, 8);
  const lastFour = number.slice(8, 12);
  if (number.length <= 6) {
    return `${firstSix}`;
  } else if (number.length == 7 || number.length == 8) {
    return `${firstSix}-${secondTwo}`;
  } else {
    return `${firstSix}-${secondTwo}-${lastFour}`;
  }
};
