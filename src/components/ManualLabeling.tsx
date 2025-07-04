import React, { useState, useMemo } from 'react';
import { SentimentResult } from '../types';

const SENTIMENT_LABELS = ['positive', 'negative', 'neutral'];

interface ManualLabelingProps {
  results: SentimentResult[];
}

interface LabeledResult extends SentimentResult {
  manualLabel?: string;
}

function computeAccuracy(labeled: LabeledResult[]) {
  const compared = labeled.filter(r => r.manualLabel);
  if (compared.length === 0) return null;
  const correct = compared.filter(r => r.manualLabel === r.sentiment).length;
  return correct / compared.length;
}

function computeConfusionMatrix(labeled: LabeledResult[]) {
  const matrix: Record<string, Record<string, number>> = {};
  SENTIMENT_LABELS.forEach(row => {
    matrix[row] = {};
    SENTIMENT_LABELS.forEach(col => {
      matrix[row][col] = 0;
    });
  });
  labeled.forEach(r => {
    if (r.manualLabel) matrix[r.manualLabel][r.sentiment]++;
  });
  return matrix;
}

const ManualLabeling: React.FC<ManualLabelingProps> = ({ results }) => {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const labeledResults: LabeledResult[] = useMemo(
    () => results.map(r => ({ ...r, manualLabel: labels[r.id] })),
    [results, labels]
  );

  const accuracy = useMemo(() => computeAccuracy(labeledResults), [labeledResults]);
  const matrix = useMemo(() => computeConfusionMatrix(labeledResults), [labeledResults]);

  const handleLabel = (id: string, label: string) => {
    setLabels(prev => ({ ...prev, [id]: label }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Manual vs Model Accuracy</h2>
      <div className="mb-4 text-sm text-gray-600">Label the sentiment for each post/comment below. The app will compare your label to the model's prediction and update the accuracy report in real time.</div>
      <table className="table-auto border w-full text-sm mb-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Text</th>
            <th className="border px-2 py-1">Model</th>
            <th className="border px-2 py-1">Your Label</th>
            <th className="border px-2 py-1">Match</th>
          </tr>
        </thead>
        <tbody>
          {labeledResults.slice(0, 10).map(r => (
            <tr key={r.id}>
              <td className="border px-2 py-1 max-w-xs">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {r.text}
                </div>
              </td>
              <td className="border px-2 py-1">{r.sentiment}</td>
              <td className="border px-2 py-1">
                <select
                  value={labels[r.id] || ''}
                  onChange={e => handleLabel(r.id, e.target.value)}
                  className="border rounded px-1 py-0.5"
                >
                  <option value="">Select</option>
                  {SENTIMENT_LABELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </td>
              <td className="border px-2 py-1 text-center">
                {r.manualLabel ? (r.manualLabel === r.sentiment ? '✔️' : '❌') : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs mb-4">Showing first 10 results. Label more to improve the report.</div>
      {accuracy !== null && (
        <div className="mb-4">
          <strong>Accuracy:</strong> {(accuracy * 100).toFixed(2)}%
        </div>
      )}
      {accuracy !== null && matrix && (
        <div className="mb-4">
          <strong>Confusion Matrix:</strong>
          <table className="table-auto border mt-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Manual \ Model</th>
                {SENTIMENT_LABELS.map(label => (
                  <th key={label} className="border px-2 py-1">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SENTIMENT_LABELS.map(row => (
                <tr key={row}>
                  <td className="border px-2 py-1 font-bold">{row}</td>
                  {SENTIMENT_LABELS.map(col => (
                    <td key={col} className="border px-2 py-1">{matrix[row][col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManualLabeling;
