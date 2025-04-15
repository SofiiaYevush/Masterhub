import React from "react";
import "./Acordion.scss";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

function AcordionClient() {
  const { t } = useTranslation("acordion-client");

  return (
    <div className="accordion-container">
      <div className="accordion-title">
        <h1>{t(`acordion-client.title`)}</h1>
      </div>
      {[1, 2, 3, 4, 5].map((num) => (
        <Accordion key={num} className="accordion-item">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="accordion-icon" />}
            aria-controls={`panel${num}-content`}
            id={`panel${num}-header`}
            className="accordion-summary"
          >
            <Typography component="span" className="accordion-title">
              {t(`acordion-client.question${num}`)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="accordion-details">
            <Typography className="accordion-text">
              {t(`acordion-client.answer${num}`)}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default AcordionClient;