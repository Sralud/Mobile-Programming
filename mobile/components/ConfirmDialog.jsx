import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfirmDialog = ({ visible, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    const scale = React.useRef(new Animated.Value(0.8)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scale.setValue(0.8);
            opacity.setValue(0);
        }
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return { name: 'trash-outline', color: '#FF6B6B' };
            case 'warning':
                return { name: 'warning-outline', color: '#FFB84D' };
            case 'info':
                return { name: 'information-circle-outline', color: '#00FFE0' };
            default:
                return { name: 'help-circle-outline', color: '#00FFE0' };
        }
    };

    const icon = getIcon();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onCancel}
        >
            <Animated.View style={[styles.overlay, { opacity }]}>
                <Animated.View style={[styles.dialog, { transform: [{ scale }] }]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon.name} size={48} color={icon.color} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, type === 'danger' && styles.dangerButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#151821',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#333',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        color: '#9AA4B2',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#333',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#00FFE0',
    },
    dangerButton: {
        backgroundColor: '#FF6B6B',
    },
    confirmButtonText: {
        color: '#0B0E14',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ConfirmDialog;
