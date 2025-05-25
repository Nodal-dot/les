import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Text, 
  Spinner, 
  Badge, 
  Stat, 
  StatLabel, 
  StatHelpText, 
  SimpleGrid, 
  Alert,
  Table,
  Input,
  Button,
  HStack
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { fetchSensorData } from '../../store/networksSlice';
import { RootState } from '../../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../hooks/useAuth';
import { downloadReport } from '../../api';

const SensorDetailsPage = () => {
  const { networkId, sensorId } = useParams<{ networkId: string; sensorId: string }>();
  const dispatch = useDispatch();
  const chartRef = useRef<HTMLDivElement>(null);
const {user} = useAuth()
  const {
    sensorData,
    loading,
    error,
    currentSensor
  } = useSelector((state: RootState) => ({
    sensorData: state.networks.sensorData,
    loading: state.networks.loading,
    error: state.networks.error,
    currentSensor: state.networks.currentSensor
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    if (networkId && sensorId) {
      dispatch(fetchSensorData({ networkId, sensorId }) as any);
    }
  }, [networkId, sensorId, dispatch]);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...sensorData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (typeof a[sortConfig.key] === 'number' && typeof b[sortConfig.key] === 'number') {
          return sortConfig.direction === 'ascending' 
            ? a[sortConfig.key] - b[sortConfig.key] 
            : b[sortConfig.key] - a[sortConfig.key];
        }
        return sortConfig.direction === 'ascending' 
          ? a[sortConfig.key].localeCompare(b[sortConfig.key]) 
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      });
    }
    return sortableData;
  }, [sensorData, sortConfig]);

  const filteredData = sortedData.filter(item => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const downloadPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `sensor_${sensorId}_chart.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
     await downloadReport.png(user.username, sensorId);

    }
  };

  const downloadPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    await downloadReport.txt(user.username, sensorId);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`sensor_${sensorId}_data.pdf`);
    }
  };

  const downloadTXT = async () => {
    let textContent = `Sensor Data Report - ${currentSensor?.name || `Sensor ${sensorId}`}\n\n`;
    
    textContent += "Statistics:\n";
    Object.entries(dataStats).forEach(([header, stats]) => {
      textContent += `${header}: Avg=${stats.avg.toFixed(2)}, Min=${stats.min.toFixed(2)}, Max=${stats.max.toFixed(2)}\n`;
    });
    
    textContent += "\nData Table:\n";
    if (headers.length > 0) {
      textContent += headers.join('\t') + '\n';
      filteredData.slice(0, 100).forEach(row => {
        textContent += headers.map(header => 
          typeof row[header] === 'number' ? parseFloat(row[header]).toFixed(2) : row[header]
        ).join('\t') + '\n';
      });
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    await downloadReport.txt(user.username, sensorId);
    link.download = `sensor_${sensorId}_data.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Загрузка данных сенсора...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert.Root status="error" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <Alert.Title fontSize="xl" mt={4} mb={1}>
          Ошибка загрузки данных датчика
        </Alert.Title>
        <Alert.Description color="gray.600">{error}</Alert.Description>
      </Alert.Root>
    );
  }

  const headers = sensorData.length > 0 ? Object.keys(sensorData[0]) : [];

  const dataStats = headers.reduce((acc, header) => {
    if (typeof sensorData[0][header] === 'number') {
      const values = sensorData.map(item => parseFloat(item[header]));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      acc[header] = { min, max, avg };
    }
    return acc;
  }, {} as Record<string, { min: number; max: number; avg: number }>);

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>
        {currentSensor?.name || `Sensor ${sensorId}`}
      </Heading>
      
      <Input 
        placeholder="Найти..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        mb={4} 
      />
      
      {/* Download buttons */}
      <HStack mb={6} >
        <Button colorScheme="blue" onClick={downloadPNG}>
          Скачать PNG
        </Button>
        <Button colorScheme="red" onClick={downloadPDF}>
          Скачать PDF
        </Button>
        <Button colorScheme="green" onClick={downloadTXT}>
          Скачать TXT
        </Button>
      </HStack>
      
      {/* Statistics Section */}
      {Object.keys(dataStats).length > 0 && (
        <>
          <Heading as="h2" size="md" mb={4} mt={8}>
            Data Statistics
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} mb={8}>
            {Object.entries(dataStats).map(([header, stats]) => (
              <Stat.Root key={header}>
                <StatLabel fontSize="lg" fontWeight="bold">
                  {header}
                </StatLabel>
                <Stat.ValueText  fontSize="xl">
                  Avg: {stats.avg.toFixed(2)}
                </Stat.ValueText >
                <StatHelpText>
                  <Badge colorScheme="blue" mr={2}>Минимум: {stats.min.toFixed(2)}</Badge>
                  <Badge colorScheme="green">Максимум: {stats.max.toFixed(2)}</Badge>
                </StatHelpText>
              </Stat.Root>
            ))}
          </SimpleGrid>
        </>
      )}
      
      {/* Data Table Section */}
      <Heading as="h2" size="md" mb={4}>
        Данные
      </Heading>
      
      {filteredData.length === 0 ? (
        <Alert.Root status="info">
          <Alert.Title>Нет данных для отображения</Alert.Title>
        </Alert.Root>
      ) : (
        <Box overflowX="auto">
          <Table.Root>
            <Table.Caption>Данные сенсора</Table.Caption>
            <Table.Header>
              <Table.Row>
                {headers.map(header => (
                  <Table.ColumnHeader key={header} onClick={() => handleSort(header)} style={{ cursor: 'pointer' }}>
                    {header} {sortConfig?.key === header ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.slice(0, 100).map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {headers.map(header => (
                    <Table.Cell key={`${rowIndex}-${header}`}>
                      {typeof row[header] === 'number' 
                        ? parseFloat(row[header]).toFixed(2)
                        : row[header]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
              {filteredData.length > 100 && (
                <Table.Row>
                  <Table.Cell colSpan={headers.length} textAlign="center" fontWeight="bold">
                    Показываем первые {filteredData.length} записей
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <Heading as="h2" size="md" mb={4} mt={8}>
        Визуализация данных
      </Heading>
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
              dataKey="timestamp" 
              tick={{ fill: '#666' }}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis 
              domain={['auto', 'auto']}
              tick={{ fill: '#666' }}
              tickFormatter={(value) => Number(value).toFixed(2)}
              />
              <Tooltip 
              contentStyle={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              />
              {headers.filter(header => header !== 'timestamp').map((header, index) => {
              const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
              return (
                  <Line
                  key={header}
                  type="monotone"
                  dataKey={header}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  />
              );
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
};

export default SensorDetailsPage;