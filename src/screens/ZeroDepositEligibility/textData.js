import React, {Fragment} from 'react';
import {View, Text} from 'react-native';
import styles from './style';

export const WorkingIndividuals = () => {
  return (
    <Fragment>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>1.</Text>
        <Text style={styles.srData}>Passport</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>2.</Text>
        <Text style={styles.srData}>Visa</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>3.</Text>
        <Text style={styles.srData}>1 month pay slip or employment letter</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>4.</Text>
        <Text style={styles.srData}>Latest 3 months bank statement</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>5.</Text>
        <Text style={styles.srData}>Other documents requested by Alicia</Text>
      </View>
    </Fragment>
  );
};

export const Students = () => {
  return (
    <Fragment>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>1.</Text>
        <Text style={styles.srData}>Passport</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>2.</Text>
        <Text style={styles.srData}>Visa</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>3.</Text>
        <Text style={styles.srData}>Student letter</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>4.</Text>
        <Text style={styles.srData}>Housemates I/C or Passport</Text>
      </View>
    </Fragment>
  );
};

export const BusinessOwners = () => {
  return (
    <Fragment>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>1.</Text>
        <Text style={styles.srData}>Passport</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>2.</Text>
        <Text style={styles.srData}>Visa</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>3.</Text>
        <Text style={styles.srData}>SSM Cert (Form 9)</Text>
      </View>
      <View style={styles.orderedRow}>
        <Text style={styles.srNo}>4.</Text>
        <Text style={styles.srData}>Latest 3 months bank statement</Text>
      </View>
    </Fragment>
  );
};
