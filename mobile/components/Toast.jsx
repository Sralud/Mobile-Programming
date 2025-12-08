import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ visible, message, type = 'success', onHide }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (onHide) onHide();
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'info':
                return 'information-circle';
            default:
                return 'checkmark-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#00FFE0';
            case 'error':
                return '#FF6B6B';
            case 'info':
                return '#4ECDC4';
            default:
                return '#00FFE0';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                    borderLeftColor: getColor(),
                },
            ]}
        >
            <Ionicons name={getIcon()} size={24} color={getColor()} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#151821',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 9999,
    },
    message: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
});

export default Toast;
