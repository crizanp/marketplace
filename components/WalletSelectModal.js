import React from 'react';
import Modal from 'react-modal';
import styles from '../styles/WalletModal.module.css';

// Set the app element for accessibility
Modal.setAppElement('#__next');

const WalletSelectModal = ({ isOpen, onClose, onSelectWallet }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.modalContent}>
                <h2 className={styles.title}>Select Your Wallet</h2>
                <button className={styles.walletOption} onClick={() => onSelectWallet('Phantom')}>
                    🐱 Phantom Wallet
                </button>
                <button className={styles.walletOption} onClick={() => onSelectWallet('Solflare')}>
                    🔥 Solflare Wallet
                </button>
                <button className={styles.walletOption} onClick={() => onSelectWallet('Slope')}>
                    🚀 Slope Wallet
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default WalletSelectModal;
