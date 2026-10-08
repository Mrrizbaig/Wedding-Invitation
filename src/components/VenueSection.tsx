import React from 'react';
import { MapPin } from 'lucide-react';

interface VenueSectionProps {
  venue: string;
  address: string[];
  mapsUrl: string;
  label?: string;
}

export default function VenueSection({ venue, address, mapsUrl, label = 'Venue' }: VenueSectionProps) {
  return (
    <div className="venue-card">
      <p className="venue-card-label">{label}</p>
      <p className="venue-card-name">{venue}</p>
      <address className="venue-card-address">
        {address.map((line, i) => <span key={i}>{line}</span>)}
      </address>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="directions-btn venue-directions-btn"
        aria-label={`Open directions to ${venue} in Google Maps`}
      >
        <MapPin size={15} strokeWidth={1.6} />
        <span>Open Directions</span>
      </a>
    </div>
  );
}
