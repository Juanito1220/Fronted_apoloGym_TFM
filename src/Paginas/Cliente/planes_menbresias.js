import React from 'react';
import ErrorBoundary from '../../Componentes/ErrorBoundary';
import PlanSubscriptionGallery from '../../Componentes/Cliente/PlanSubscriptionGallery';

const PlanesMembresías = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <PlanSubscriptionGallery />
      </ErrorBoundary>
    </div>
  );
};

export default PlanesMembresías;