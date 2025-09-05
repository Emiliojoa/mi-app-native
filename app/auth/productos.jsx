import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BarcodeScanner from '../../components/BarcodeScanner';
import { useProducts } from '../../contexts/ProductContext';

const ProductsScreen = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByCode,
    clearError,
  } = useProducts();

  // Estados para el modal de formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  // Estado para búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Limpiar error al montar el componente
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
    setEditingProduct(null);
  };

  // Abrir modal para nuevo producto
  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar producto
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      stock: product.stock?.toString() || '',
    });
    setModalVisible(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Manejar escaneo de código
  const handleBarcodeScanned = ({ data }) => {
    setScannerVisible(false);
    
    // Verificar si el producto ya existe
    const existingProduct = getProductByCode(data);
    
    if (existingProduct) {
      Alert.alert(
        'Producto Encontrado',
        `El producto "${existingProduct.name}" ya existe. ¿Deseas editarlo?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Editar', onPress: () => openEditModal(existingProduct) },
        ]
      );
    } else {
      // Nuevo producto con código escaneado
      setFormData(prev => ({ ...prev, code: data }));
      setModalVisible(true);
    }
  };

  // Guardar producto
  const handleSave = async () => {
    // Validaciones básicas
    if (!formData.name.trim() || !formData.code.trim()) {
      Alert.alert('Error', 'El nombre y código son obligatorios');
      return;
    }

    const price = parseFloat(formData.price) || 0;
    const stock = parseInt(formData.stock) || 0;

    const productData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
      price: price,
      category: formData.category.trim(),
      stock: stock,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        // Verificar si el código ya existe (para nuevos productos)
        const existingProduct = getProductByCode(productData.code);
        if (existingProduct) {
          Alert.alert('Error', 'Ya existe un producto con ese código');
          return;
        }
        
        await addProduct(productData);
        Alert.alert('Éxito', 'Producto agregado correctamente');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  // Eliminar producto
  const handleDelete = (product) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert('Éxito', 'Producto eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  // Renderizar item de producto
  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.productCode}>Código: {item.code}</Text>
      {item.description && (
        <Text style={styles.productDescription}>{item.description}</Text>
      )}
      
      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        {item.category && (
          <Text style={styles.productCategory}>{item.category}</Text>
        )}
        {item.stock !== undefined && (
          <Text style={styles.productStock}>Stock: {item.stock}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Productos</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Botones de acción */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.primaryButton} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Nuevo Producto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={() => setScannerVisible(true)}
        >
          <Ionicons name="scan" size={20} color="#fff" />
          <Text style={styles.scanButtonText}>Escanear</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No se encontraron productos' : 'No hay productos registrados'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Intenta con otra búsqueda' : 'Agrega tu primer producto'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal de formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ingresa el nombre del producto"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Código *</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={[styles.formInput, styles.codeInput]}
                  placeholder="Código del producto"
                  value={formData.code}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, code: text }))}
                />
                <TouchableOpacity 
                  style={styles.scanIconButton}
                  onPress={() => setScannerVisible(true)}
                >
                  <Ionicons name="scan" size={20} color="#007bff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Descripción</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Descripción del producto"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Precio</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0.00"
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Categoría del producto"
                value={formData.category}
                onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Stock</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0"
                value={formData.stock}
                onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingProduct ? 'Actualizar' : 'Guardar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Scanner de códigos */}
      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.7,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.25,
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  productCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  productCategory: {
    fontSize: 12,
    backgroundColor: '#e9ecef',
    color: '#495057',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productStock: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginVertical: 10,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
  },
  scanIconButton: {
    padding: 12,
    marginLeft: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductsScreen;
