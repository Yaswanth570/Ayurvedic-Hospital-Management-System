import React from 'react';
import './Awareness.css';

/**
 * Awareness component for health education and Ayurvedic knowledge
 * Displays static content about Ayurvedic practices and health awareness
 */
const Awareness = () => {
  return (
    <div className="awareness-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Health Awareness</h1>
          <p className="page-subtitle">Learn about Ayurvedic practices and holistic health</p>
        </div>

        {/* Ayurvedic Principles */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🏛️ Fundamental Principles of Ayurveda</h2>
            </div>
            <div className="card-body">
              <div className="principles-grid">
                <div className="principle-item">
                  <div className="principle-icon">⚖️</div>
                  <h3>Tridosha Theory</h3>
                  <p>
                    The foundation of Ayurveda is based on three fundamental energies or doshas: 
                    Vata (air & space), Pitta (fire & water), and Kapha (earth & water). 
                    Balance of these doshas is essential for optimal health.
                  </p>
                </div>
                <div className="principle-item">
                  <div className="principle-icon">🌱</div>
                  <h3>Panchamahabhutas</h3>
                  <p>
                    Everything in the universe is composed of five basic elements: 
                    Earth (Prithvi), Water (Jala), Fire (Agni), Air (Vayu), and Space (Akasha). 
                    These elements combine to form the three doshas.
                  </p>
                </div>
                <div className="principle-item">
                  <div className="principle-icon">🔄</div>
                  <h3>Prakriti & Vikriti</h3>
                  <p>
                    Prakriti is your natural constitution determined at birth, while Vikriti 
                    refers to the current state of imbalance. Understanding both helps in 
                    maintaining health and treating diseases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Routines */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🌅 Dinacharya - Daily Routine</h2>
            </div>
            <div className="card-body">
              <div className="routine-timeline">
                <div className="timeline-item">
                  <div className="timeline-time">4:00 - 6:00 AM</div>
                  <div className="timeline-content">
                    <h4>Brahma Muhurta (Wake up)</h4>
                    <p>Wake up during this auspicious time for mental clarity and spiritual growth.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-time">6:00 - 7:00 AM</div>
                  <div className="timeline-content">
                    <h4>Morning Hygiene</h4>
                    <p>Clean teeth with herbal twigs, scrape tongue, and perform oil pulling for oral health.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-time">7:00 - 8:00 AM</div>
                  <div className="timeline-content">
                    <h4>Exercise & Yoga</h4>
                    <p>Practice yoga, pranayama, or light exercise to energize the body and mind.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-time">8:00 - 9:00 AM</div>
                  <div className="timeline-content">
                    <h4>Breakfast</h4>
                    <p>Have a light, warm breakfast that's easy to digest and suits your dosha.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-time">6:00 - 7:00 PM</div>
                  <div className="timeline-content">
                    <h4>Dinner</h4>
                    <p>Eat dinner before sunset with lighter foods that are easy to digest.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-time">9:00 - 10:00 PM</div>
                  <div className="timeline-content">
                    <h4>Bedtime</h4>
                    <p>Go to bed early for proper rest and rejuvenation of body tissues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Guidelines */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🌿 Ritucharya - Seasonal Guidelines</h2>
            </div>
            <div className="card-body">
              <div className="seasons-grid">
                <div className="season-item">
                  <div className="season-icon">🌸</div>
                  <h3>Spring (Vasant)</h3>
                  <p><strong>Dominant Dosha:</strong> Kapha</p>
                  <ul>
                    <li>Eat light, warm foods</li>
                    <li>Increase physical activity</li>
                    <li>Include bitter and astringent tastes</li>
                    <li>Practice detoxification</li>
                  </ul>
                </div>
                <div className="season-item">
                  <div className="season-icon">☀️</div>
                  <h3>Summer (Grishma)</h3>
                  <p><strong>Dominant Dosha:</strong> Pitta</p>
                  <ul>
                    <li>Stay hydrated with cool drinks</li>
                    <li>Eat sweet, bitter, and astringent foods</li>
                    <li>Avoid excessive heat and spicy foods</li>
                    <li>Take afternoon naps if needed</li>
                  </ul>
                </div>
                <div className="season-item">
                  <div className="season-icon">🍂</div>
                  <h3>Autumn (Sharad)</h3>
                  <p><strong>Dominant Dosha:</strong> Pitta</p>
                  <ul>
                    <li>Eat sweet, bitter, and astringent foods</li>
                    <li>Practice cooling therapies</li>
                    <li>Wear light, cotton clothing</li>
                    <li>Avoid excessive sun exposure</li>
                  </ul>
                </div>
                <div className="season-item">
                  <div className="season-icon">❄️</div>
                  <h3>Winter (Hemant & Shishir)</h3>
                  <p><strong>Dominant Dosha:</strong> Vata</p>
                  <ul>
                    <li>Eat warm, oily, and heavy foods</li>
                    <li>Include sweet, sour, and salty tastes</li>
                    <li>Practice oil massage (Abhyanga)</li>
                    <li>Stay warm and avoid cold drafts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diet Guidelines */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🍽️ Ahara - Dietary Guidelines</h2>
            </div>
            <div className="card-body">
              <div className="diet-content">
                <div className="diet-section">
                  <h3>Six Tastes (Shad Rasa)</h3>
                  <div className="tastes-grid">
                    <div className="taste-item">
                      <span className="taste-name">Sweet (Madhura)</span>
                      <span className="taste-description">Builds tissues, calms nerves</span>
                    </div>
                    <div className="taste-item">
                      <span className="taste-name">Sour (Amla)</span>
                      <span className="taste-description">Stimulates digestion, energizes</span>
                    </div>
                    <div className="taste-item">
                      <span className="taste-name">Salty (Lavana)</span>
                      <span className="taste-description">Improves taste, softens tissues</span>
                    </div>
                    <div className="taste-item">
                      <span className="taste-name">Pungent (Katu)</span>
                      <span className="taste-description">Clears sinuses, improves circulation</span>
                    </div>
                    <div className="taste-item">
                      <span className="taste-name">Bitter (Tikta)</span>
                      <span className="taste-description">Detoxifies, reduces inflammation</span>
                    </div>
                    <div className="taste-item">
                      <span className="taste-name">Astringent (Kashaya)</span>
                      <span className="taste-description">Absorbs water, tightens tissues</span>
                    </div>
                  </div>
                </div>

                <div className="diet-section">
                  <h3>General Dietary Principles</h3>
                  <ul className="diet-principles">
                    <li>Eat fresh, seasonal, and locally grown foods</li>
                    <li>Include all six tastes in your meals</li>
                    <li>Eat at regular times and in proper quantities</li>
                    <li>Chew food thoroughly for better digestion</li>
                    <li>Avoid incompatible food combinations</li>
                    <li>Drink warm water throughout the day</li>
                    <li>Eat your largest meal at lunchtime</li>
                    <li>Allow 3-4 hours between meals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Ailments */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🏥 Common Ailments & Ayurvedic Approaches</h2>
            </div>
            <div className="card-body">
              <div className="ailments-grid">
                <div className="ailment-item">
                  <h4>Digestive Issues</h4>
                  <p><strong>Ayurvedic Approach:</strong></p>
                  <ul>
                    <li>Drink ginger tea before meals</li>
                    <li>Practice mindful eating</li>
                    <li>Include digestive spices like cumin, coriander, fennel</li>
                    <li>Avoid cold drinks with meals</li>
                  </ul>
                </div>
                <div className="ailment-item">
                  <h4>Stress & Anxiety</h4>
                  <p><strong>Ayurvedic Approach:</strong></p>
                  <ul>
                    <li>Practice daily meditation and pranayama</li>
                    <li>Regular oil massage (Abhyanga)</li>
                    <li>Include calming herbs like ashwagandha, brahmi</li>
                    <li>Maintain consistent sleep schedule</li>
                  </ul>
                </div>
                <div className="ailment-item">
                  <h4>Insomnia</h4>
                  <p><strong>Ayurvedic Approach:</strong></p>
                  <ul>
                    <li>Establish bedtime routine</li>
                    <li>Drink warm milk with nutmeg before bed</li>
                    <li>Avoid screens 1 hour before sleep</li>
                    <li>Practice gentle yoga or meditation</li>
                  </ul>
                </div>
                <div className="ailment-item">
                  <h4>Seasonal Allergies</h4>
                  <p><strong>Ayurvedic Approach:</strong></p>
                  <ul>
                    <li>Nasal irrigation with saline water</li>
                    <li>Include anti-inflammatory foods</li>
                    <li>Practice breathing exercises</li>
                    <li>Use local honey for immunity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preventive Care */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>🛡️ Preventive Care & Wellness</h2>
            </div>
            <div className="card-body">
              <div className="prevention-content">
                <div className="prevention-section">
                  <h3>Daily Self-Care Practices</h3>
                  <div className="practices-grid">
                    <div className="practice-item">
                      <div className="practice-icon">🛁</div>
                      <h4>Oil Massage (Abhyanga)</h4>
                      <p>Daily self-massage with warm oil to nourish skin, improve circulation, and calm the nervous system.</p>
                    </div>
                    <div className="practice-item">
                      <div className="practice-icon">🧘</div>
                      <h4>Meditation & Pranayama</h4>
                      <p>Regular practice of breathing exercises and meditation for mental clarity and emotional balance.</p>
                    </div>
                    <div className="practice-item">
                      <div className="practice-icon">🧘‍♀️</div>
                      <h4>Yoga Asanas</h4>
                      <p>Gentle stretching and strengthening exercises to maintain flexibility and vitality.</p>
                    </div>
                    <div className="practice-item">
                      <div className="practice-icon">🌿</div>
                      <h4>Herbal Teas</h4>
                      <p>Drinking herbal teas like tulsi, ginger, or chamomile for their therapeutic benefits.</p>
                    </div>
                  </div>
                </div>

                <div className="prevention-section">
                  <h3>Seasonal Detoxification</h3>
                  <p>
                    Ayurveda recommends seasonal cleansing to remove accumulated toxins (ama) from the body. 
                    This can include Panchakarma therapies, fasting, or simple dietary modifications based on 
                    your constitution and the season.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="awareness-section">
          <div className="card">
            <div className="card-header">
              <h2>📞 Need More Information?</h2>
            </div>
            <div className="card-body">
              <div className="contact-info">
                <p>
                  For personalized Ayurvedic consultations and treatments, please contact our qualified 
                  Ayurvedic practitioners. They can help you understand your unique constitution and 
                  create a customized wellness plan.
                </p>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span>Call: +1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <span>Email: info@ayurvedichospital.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <span>Hours: Mon-Sat 8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
