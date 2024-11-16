import React, { useState } from 'react';
import ListModal from '@/components/modals/ListModal';
import EthernetModal from '@/components/modals/EthernetModal';

const ExampleScreen: React.FC = () => {
  const [isListModalVisible, setListModalVisible] = useState(false);
  const [isEthernetModalVisible, setEthernetModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [fields, setFields] = useState([
    { label: 'IP Address', value: '', onChange: (text: string) => updateField('IP Address', text) },
    { label: 'Port', value: '', onChange: (text: string) => updateField('Port', text) },
  ]);

  const data = ['Item 1', 'Item 2', 'Item 3'];

  const updateField = (label: string, text: string) => {
    setFields(fields.map(field => 
      field.label === label ? { ...field, value: text } : field
    ));
  };

  const handleSaveEthernet = (fields: { label: string; value: string }[]) => {
    console.log('Saved:', fields);
    setEthernetModalVisible(false);
  };

  return (
    <div>
      <button onClick={() => setListModalVisible(true)}>Show List Modal</button>
      <button onClick={() => setEthernetModalVisible(true)}>Show Ethernet Modal</button>

      <ListModal
        visible={isListModalVisible}
        data={data}
        renderItem={(item) => <span>{item}</span>}
        onSelect={(item) => {
          setSelectedItem(item);
          setListModalVisible(false);
        }}
        onClose={() => setListModalVisible(false)}
        title="Select an Item"
      />

      <EthernetModal
        visible={isEthernetModalVisible}
        fields={fields}
        onSave={handleSaveEthernet}
        onClose={() => setEthernetModalVisible(false)}
        title="Configure Ethernet"
      />
    </div>
  );
};

export default ExampleScreen;
