import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({loading}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={loading}
      onRequestClose={() => setLoading(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
  });

export default Loader;