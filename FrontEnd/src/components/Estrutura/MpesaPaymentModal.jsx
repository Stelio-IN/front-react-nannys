import React, { useState } from 'react';
import mpesa from '../../assets/mpesa.png'
const MpesaPaymentModal = ({ isOpen, onClose, reservationId, amount }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:3005/mpesa/pay';

    const reservationIdInput = document.createElement('input');
    reservationIdInput.type = 'hidden';
    reservationIdInput.name = 'reservationId';
    reservationIdInput.value = reservationId;

    const phoneNumberInput = document.createElement('input');
    phoneNumberInput.type = 'hidden';
    phoneNumberInput.name = 'phoneNumber';
    phoneNumberInput.value = phoneNumber;

    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = amount;

    form.appendChild(reservationIdInput);
    form.appendChild(phoneNumberInput);
    form.appendChild(amountInput);
    document.body.appendChild(form);
    form.submit();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          width: '400px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>M-Pesa Payment</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={mpesa}
        alt="M-Pesa Logo"
        style={{ maxWidth: '100px' }}
      />
    </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="phoneNumber"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your M-Pesa number"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div
            style={{
              background: '#f9f9f9',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#666' }}>Payment Amount:</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${amount}</p>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Confirm Payment
          </button>
        </form>
        <button
          onClick={onClose}
          style={{
            marginTop: '10px',
            width: '100%',
            backgroundColor: '#ccc',
            color: 'black',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;
