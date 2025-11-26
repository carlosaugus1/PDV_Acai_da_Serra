document.addEventListener('DOMContentLoaded', () => {
    const App = {
        state: {
            cart: [],
            manualSaleCart: [],
            salesHistory: {},
            expenses: {}, 
            openOrders: [], 
            products: [
                { id: 1, name: "Água", price: 3.00, category: "Bebidas", image: "" }, 
                { id: 2, name: "Água com Gás", price: 3.00, category: "Bebidas", image: "" }
            ],
            config: {
                açaíPricePerKg: 43.90,
                sorvetePricePerKg: 43.90, 
                deletePassword: '1015',
            },
            discount: {
                active: false,
                percentage: 10,
                targets: {
                    acai: false,
                    sorvete: false
                }
            },
            ui: {
                currentWeightedProduct: 'acai', 
                currentPaymentMethod: null,
                manualSalePaymentMethod: null,
                openOrderPaymentMethod: null, 
                currentOpenOrder: null, 
                openOrderTimerInterval: null, 
                deliveryMode: 'balcao', 
                isAdminLoggedIn: false,
                saleToDelete: null,
                expenseToDelete: null,
                lastSaleForReceipt: null,
                today: new Date().toISOString().split('T')[0],
            }
        },
        
        DOM: {},

        init() {
            this.cacheDOM();
            this.storage.load();
            this.checkThursdayDiscount();
            this.bindEvents();
            this.render.all();
            this.render.discountControls();
            this.render.activeDiscountIndicator();
        },

        checkThursdayDiscount() {
            const today = new Date();
            const isThursday = today.getDay() === 4; 
            
            if (isThursday) {
                this.state.discount.active = true;
                this.state.discount.percentage = 10;
                this.state.discount.targets.acai = true;
            }
        },

        cacheDOM() {
            this.DOM = {
                container: document.querySelector('.container'),
                currentDate: document.getElementById('current-date'),
                weightInput: document.getElementById('weight-input'),
                calculatedPrice: document.getElementById('calculated-price'),
                weightedProductPriceDisplay: document.getElementById('weighted-product-price-display'),
                productTypeSelector: document.querySelector('.product-type-selector'),
                cartItems: document.getElementById('cart-items'),
                subtotal: document.getElementById('subtotal'),
                total: document.getElementById('total'),
                paymentSection: document.querySelector('.payment-section'),
                confirmPaymentButton: document.getElementById('confirm-payment'),
                cashInputSection: document.getElementById('cash-input'),
                cashReceivedInput: document.getElementById('cash-received'),
                changeDisplay: document.getElementById('change-display'),
                changeAmount: document.getElementById('change-amount'),
                productSearch: document.getElementById('product-search'),
                productsCategoriesList: document.getElementById('products-categories-list'),
                productsGrid: document.getElementById('products-grid'),
                historyDate: document.getElementById('history-date'),
                salesHistory: document.getElementById('sales-history'),
                
                historySummary: document.getElementById('history-summary'),
                historyProductsTotal: document.getElementById('history-products-total'),
                historyDeliveryTotal: document.getElementById('history-delivery-total'),
                historyExpensesTotal: document.getElementById('history-expenses-total'),
                historyGrandTotal: document.getElementById('history-grand-total'),

                loginSection: document.getElementById('login-section'),
                adminControlsPanel: document.getElementById('admin-controls-panel'),
                acaiPriceInput: document.getElementById('acai-price'),
                sorvetePriceInput: document.getElementById('sorvete-price'),
                deletePasswordInput: document.getElementById('delete-password'),
                productsManagement: document.getElementById('products-management'),
                notification: document.getElementById('notification'),
                passwordModal: document.getElementById('password-modal'),
                confirmDeletePasswordInput: document.getElementById('confirm-delete-password'),
                receiptModal: document.getElementById('receipt-modal'),
                receiptContent: document.getElementById('receipt-content'),
                manualSaleModal: document.getElementById('manual-sale-modal'),
                manualProductSelect: document.getElementById('manual-product-select'),
                manualAcaiWeightSection: document.getElementById('manual-acai-weight-section'),
                manualAcaiWeightInput: document.getElementById('manual-acai-weight'),
                manualSaleCartItems: document.getElementById('manual-sale-cart-items'),
                manualSaleSummary: document.getElementById('manual-sale-summary'),
                manualSaleTotal: document.getElementById('manual-sale-total'),
                newProductName: document.getElementById('new-product-name'),
                newProductPrice: document.getElementById('new-product-price'),
                newProductCategory: document.getElementById('new-product-category'),
                
                holdSaleButton: document.getElementById('hold-sale'),
                openOrdersCount: document.getElementById('open-orders-count'),
                openOrdersGrid: document.getElementById('open-orders-grid'),
                
                holdSaleModal: document.getElementById('hold-sale-modal'),
                customerNameInput: document.getElementById('customer-name'),
                existingOrderSelect: document.getElementById('existing-order-select'),
                saveHoldSaleButton: document.getElementById('save-hold-sale-btn'),
                closeHoldSaleButton: document.getElementById('close-hold-sale-btn'),
                
                openOrderModal: document.getElementById('open-order-modal'),
                openOrderTitle: document.getElementById('open-order-title'),
                openOrderTimer: document.getElementById('open-order-timer'),
                openOrderItemsList: document.getElementById('open-order-items-list'),
                openOrderTotal: document.getElementById('open-order-total'),
                openOrderPaymentOptions: document.getElementById('open-order-payment-options'),
                openOrderCashInput: document.getElementById('open-order-cash-input'),
                openOrderCashReceived: document.getElementById('open-order-cash-received'),
                openOrderChangeDisplay: document.getElementById('open-order-change-display'),
                openOrderChangeAmount: document.getElementById('open-order-change-amount'),
                confirmOpenOrderPaymentButton: document.getElementById('confirm-open-order-payment'),
                closeOpenOrderButton: document.getElementById('close-open-order-btn'),

                deliveryModeSelector: document.getElementById('delivery-mode-selector'),
                deliveryInfoSection: document.getElementById('delivery-info-section'),
                deliveryCustomerName: document.getElementById('delivery-customer-name'),
                deliveryCustomerAddress: document.getElementById('delivery-customer-address'),
                deliveryFee: document.getElementById('delivery-fee'),

                expenseDate: document.getElementById('expense-date'),
                newExpenseName: document.getElementById('new-expense-name'),
                newExpenseDesc: document.getElementById('new-expense-desc'),
                newExpenseValue: document.getElementById('new-expense-value'),
                addNewExpenseBtn: document.getElementById('add-new-expense-btn'),
                expensesHistoryList: document.getElementById('expenses-history-list'),
                expensesSummary: document.getElementById('expenses-summary'),
                expensesTotalToday: document.getElementById('expenses-total-today'),

                reportMonthSelect: document.getElementById('report-month-select'),
                generateMonthlyReportPdfBtn: document.getElementById('generate-monthly-report-pdf'),

                discountActiveCheck: document.getElementById('discount-active-check'),
                discountConfigArea: document.getElementById('discount-config-area'),
                discountPercentageInput: document.getElementById('discount-percentage'),
                discountTargetAcai: document.getElementById('discount-target-acai'),
                discountTargetSorvete: document.getElementById('discount-target-sorvete'),
                saveDiscountConfigBtn: document.getElementById('save-discount-config'),
                discountBalloon: document.getElementById('discount-balloon'),
                discountDetails: document.getElementById('discount-details'),
            };
        },

        bindEvents() {
            this.DOM.weightInput.addEventListener('input', (e) => this.handlers.calculateWeightedPrice(e));
            document.getElementById('add-to-cart').addEventListener('click', () => this.handlers.addWeightedProductToCart());
            if (this.DOM.productTypeSelector) {
                this.DOM.productTypeSelector.querySelectorAll('.quick-add-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.handlers.selectWeightedProduct(e.currentTarget.dataset.type));
                });
            }
            document.getElementById('add-new-product-btn').addEventListener('click', () => this.handlers.addNewProduct());
            document.querySelectorAll('.quick-add-btn[data-product-id]').forEach(btn => btn.addEventListener('click', (e) => this.handlers.addQuickProduct(e)));
            document.getElementById('finish-sale').addEventListener('click', () => this.handlers.preparePayment());
            document.getElementById('cancel-sale').addEventListener('click', () => this.handlers.cancelSale());
            document.querySelectorAll('#venda-tab .payment-option').forEach(el => el.addEventListener('click', () => this.handlers.selectPaymentMethod(el)));
            this.DOM.confirmPaymentButton.addEventListener('click', () => this.handlers.confirmPayment());
            this.DOM.cashReceivedInput.addEventListener('input', () => this.handlers.calculateChange());
            this.DOM.productSearch.addEventListener('input', () => this.render.products());
            this.DOM.historyDate.addEventListener('change', (e) => this.render.history(e.target.value));
            document.getElementById('add-manual-sale-btn').addEventListener('click', () => this.handlers.openManualSaleModal());
            document.getElementById('export-history-pdf').addEventListener('click', () => this.handlers.exportHistoryToPDF());
            document.getElementById('login-btn').addEventListener('click', () => this.handlers.login());
            document.getElementById('logout-btn').addEventListener('click', () => this.handlers.logout());
            document.getElementById('update-acai-price').addEventListener('click', () => this.handlers.updateAcaiPrice());
            document.getElementById('update-sorvete-price').addEventListener('click', () => this.handlers.updateSorvetePrice());
            document.getElementById('update-delete-password').addEventListener('click', () => this.handlers.updateDeletePassword());
            document.getElementById('print-receipt-btn').addEventListener('click', () => this.handlers.printLastReceiptModal());
            document.getElementById('close-receipt-btn').addEventListener('click', () => this.DOM.receiptModal.style.display = 'none');
            document.getElementById('confirm-delete').addEventListener('click', () => this.handlers.confirmDelete()); 
            document.getElementById('cancel-delete').addEventListener('click', () => {
                this.DOM.passwordModal.style.display = 'none';
                this.DOM.confirmDeletePasswordInput.value = '';
            });
            document.getElementById('close-manual-sale-btn').addEventListener('click', () => this.DOM.manualSaleModal.style.display = 'none');
            this.DOM.manualProductSelect.addEventListener('change', (e) => this.handlers.toggleManualWeightInput(e));
            document.getElementById('manual-add-item-btn').addEventListener('click', () => this.handlers.addManualItem());
            document.getElementById('save-manual-sale-btn').addEventListener('click', () => this.handlers.saveManualSale());
            document.querySelectorAll('#manual-payment-options .payment-option').forEach(el => el.addEventListener('click', () => this.handlers.selectManualPaymentMethod(el)));
            document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', (e) => this.handlers.switchTab(e.currentTarget.dataset.tab)));
            document.querySelectorAll('.admin-sub-tab').forEach(t => t.addEventListener('click', (e) => this.handlers.switchAdminSubTab(e.currentTarget.dataset.subtab)));
            
            this.DOM.container.addEventListener('click', (e) => {
                if (e.target.matches('.cart-item .btn-remove')) this.handlers.removeFromCart(e.target.dataset.index);
                if (e.target.matches('#manual-sale-cart-items .btn-remove')) this.handlers.removeManualItem(e.target.dataset.index);
                if (e.target.matches('.sales-history .delete-sale')) this.handlers.requestDeleteSale(e.target);
                
                // Seletor corrigido para garantir que o clique no botão de excluir despesa funcione
                if (e.target.matches('.delete-expense')) this.handlers.requestDeleteExpense(e.target);
                
                if (e.target.matches('.sales-history .reprint-sale')) {
                    this.handlers.reprintSale(e.target);
                }
                if (e.target.matches('.delete-product-btn')) this.handlers.deleteProduct(e.target.dataset.id);
            });
            
            this.DOM.holdSaleButton.addEventListener('click', () => this.handlers.requestHoldSale());
            this.DOM.saveHoldSaleButton.addEventListener('click', () => this.handlers.saveHoldSale());
            this.DOM.closeHoldSaleButton.addEventListener('click', () => this.DOM.holdSaleModal.style.display = 'none');
            
            this.DOM.openOrdersGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.open-order-card');
                if (card) {
                    this.handlers.openOrderDetails(parseInt(card.dataset.id));
                }
            });
            
            this.DOM.closeOpenOrderButton.addEventListener('click', () => this.handlers.closeOpenOrderModal());
            this.DOM.openOrderPaymentOptions.querySelectorAll('.payment-option').forEach(el => {
                el.addEventListener('click', () => this.handlers.selectOpenOrderPaymentMethod(el));
            });
            this.DOM.openOrderCashReceived.addEventListener('input', () => this.handlers.calculateOpenOrderChange());
            this.DOM.confirmOpenOrderPaymentButton.addEventListener('click', () => this.handlers.finalizeOpenOrderPayment());

            this.DOM.deliveryModeSelector.querySelectorAll('.delivery-mode-btn').forEach(btn => {
                btn.addEventListener('click', (e)=> this.handlers.selectDeliveryMode(e.currentTarget.dataset.mode));
            });
            
            this.DOM.deliveryFee.addEventListener('input', () => this.render.cart());
            this.DOM.addNewExpenseBtn.addEventListener('click', () => this.handlers.addNewExpense());
            this.DOM.expenseDate.addEventListener('change', (e) => this.render.expenses(e.target.value));
            this.DOM.generateMonthlyReportPdfBtn.addEventListener('click', () => this.handlers.exportMonthlyReportToPDF());

            this.DOM.discountActiveCheck.addEventListener('change', (e) => this.handlers.toggleDiscountConfig(e));
            this.DOM.saveDiscountConfigBtn.addEventListener('click', () => this.handlers.saveDiscountConfig());
        },

        handlers: {
            switchTab(tabName) {
                document.querySelector('.tab.active').classList.remove('active');
                document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                if (tabName === 'despesas') {
                    App.DOM.expenseDate.value = App.state.ui.today;
                    App.render.expenses(App.state.ui.today);
                }
            },
            switchAdminSubTab(subTabName) {
                  document.querySelector('.admin-sub-tab.active').classList.remove('active');
                  document.querySelector(`.admin-sub-tab[data-subtab="${subTabName}"]`).classList.add('active');
                  document.querySelectorAll('.admin-sub-content').forEach(c => c.classList.remove('active'));
                  document.getElementById(`admin-${subTabName}-content`).classList.add('active');
                  
                  if (subTabName === 'relatorios') {
                      if (!App.DOM.reportMonthSelect.value) {
                          const today = new Date();
                          const month = String(today.getMonth() + 1).padStart(2, '0');
                          const year = today.getFullYear();
                          App.DOM.reportMonthSelect.value = `${year}-${month}`;
                      }
                  }
            },
            
            toggleDiscountConfig(e) {
                const isActive = e.target.checked;
                if (isActive) {
                    App.DOM.discountConfigArea.classList.remove('disabled');
                } else {
                    App.DOM.discountConfigArea.classList.add('disabled');
                }
                App.state.discount.active = isActive;
                App.render.activeDiscountIndicator();
            },
            saveDiscountConfig() {
                const isActive = App.DOM.discountActiveCheck.checked;
                const percentage = parseFloat(App.DOM.discountPercentageInput.value);
                const acaiTarget = App.DOM.discountTargetAcai.checked;
                const sorveteTarget = App.DOM.discountTargetSorvete.checked;

                if (isActive && !percentage) {
                    return App.utils.showNotification('Defina uma porcentagem válida.', 'error');
                }

                App.state.discount = {
                    active: isActive,
                    percentage: percentage || 0,
                    targets: {
                        acai: acaiTarget,
                        sorvete: sorveteTarget
                    }
                };

                App.render.activeDiscountIndicator();
                App.utils.showNotification(isActive ? 'Promoção ativada!' : 'Promoção desativada.', 'success');
            },

            selectWeightedProduct(type) {
                App.state.ui.currentWeightedProduct = type;
                App.render.weightedProductSelector();
                App.render.weightedProductPrice();
                const event = new Event('input', { bubbles: true, cancelable: true });
                App.DOM.weightInput.dispatchEvent(event);
            },
            calculateWeightedPrice(e) {
                const weight = parseFloat(e.target.value) || 0;
                const pricePerKg = App.state.ui.currentWeightedProduct === 'acai'
                    ? App.state.config.açaíPricePerKg
                    : App.state.config.sorvetePricePerKg;
                App.DOM.calculatedPrice.textContent = (weight / 1000 * pricePerKg).toFixed(2);
            },
            
            calculateChange() {
                let subtotal = App.state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
                let deliveryFee = 0;
                if (App.state.ui.deliveryMode === 'entrega') {
                    deliveryFee = parseFloat(App.DOM.deliveryFee.value) || 0;
                }
                const total = subtotal + deliveryFee;
                
                const received = parseFloat(App.DOM.cashReceivedInput.value) || 0;
                if (received >= total) {
                    App.DOM.changeAmount.textContent = (received - total).toFixed(2);
                    App.DOM.changeDisplay.style.display = 'block';
                } else {
                    App.DOM.changeDisplay.style.display = 'none';
                }
            },
            addWeightedProductToCart() {
                const weight = parseFloat(App.DOM.weightInput.value);
                if (!weight || weight <= 0) return App.utils.showNotification('Digite um peso válido.', 'error');
                
                const type = App.state.ui.currentWeightedProduct;
                const pricePerKg = type === 'acai'
                    ? App.state.config.açaíPricePerKg
                    : App.state.config.sorvetePricePerKg;
                const name = type === 'acai' ? 'Açaí por KG' : 'Sorvete por KG';

                let finalPrice = (weight / 1000) * pricePerKg;
                let originalPrice = null;
                let discountInfo = null;

                const { discount } = App.state;
                if (discount.active) {
                    const isAcaiTarget = type === 'acai' && discount.targets.acai;
                    const isSorveteTarget = type === 'sorvete' && discount.targets.sorvete;

                    if (isAcaiTarget || isSorveteTarget) {
                        originalPrice = finalPrice;
                        const discountAmount = (finalPrice * discount.percentage) / 100;
                        finalPrice = finalPrice - discountAmount;
                        discountInfo = {
                            percentage: discount.percentage,
                            amount: discountAmount
                        };
                    }
                }

                App.state.cart.push({ 
                    id: Date.now(), 
                    name, 
                    pricePerKg, 
                    weightGrams: weight, 
                    totalPrice: finalPrice, 
                    originalPrice: originalPrice, 
                    discountInfo: discountInfo,
                    type: "weight" 
                });

                App.render.cart(); 
                const msg = discountInfo ? `${name} adicionado com ${discount.percentage}% OFF!` : `${name} adicionado.`;
                App.utils.showNotification(msg, 'success');
                App.DOM.weightInput.value = '';
                App.DOM.calculatedPrice.textContent = '0.00';
            },
            addQuickProduct(e) {
                const productId = parseInt(e.currentTarget.dataset.productId);
                const product = App.state.products.find(p => p.id === productId);
                if (product) this.addProductToCart(product);
            },
            addProductToCart(product) {
                App.state.cart.push({ id: Date.now(), name: product.name, totalPrice: product.price, type: "product" });
                App.render.cart(); 
                App.utils.showNotification(`${product.name} adicionado.`, 'success');
            },
            removeFromCart(index) {
                const removed = App.state.cart.splice(index, 1)[0];
                App.render.cart(); 
                App.utils.showNotification(`${removed.name} removido.`, 'warning');
            },
            preparePayment() {
                if (App.state.cart.length > 0) {
                    App.DOM.confirmPaymentButton.style.display = 'flex';
                    App.DOM.paymentSection.scrollIntoView({ behavior: 'smooth' });
                } else App.utils.showNotification('Carrinho vazio.', 'error');
            },
            selectPaymentMethod(el) {
                App.state.ui.currentPaymentMethod = el.dataset.method;
                document.querySelectorAll('#venda-tab .payment-option').forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
                App.DOM.cashInputSection.style.display = (el.dataset.method === 'cash') ? 'block' : 'none';
                this.calculateChange();
            },

            selectDeliveryMode(mode) {
                App.state.ui.deliveryMode = mode;
                App.render.deliveryMode();
                App.render.cart(); 
            },

            confirmPayment() {
                const { ui, cart, salesHistory } = App.state;
                if (!ui.currentPaymentMethod) return App.utils.showNotification('Selecione uma forma de pagamento.', 'error');
                
                const deliveryMode = App.state.ui.deliveryMode;
                const customerName = App.DOM.deliveryCustomerName.value;
                const customerAddress = App.DOM.deliveryCustomerAddress.value;
                const deliveryFee = parseFloat(App.DOM.deliveryFee.value) || 0;
                
                const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
                const total = subtotal + (deliveryMode === 'entrega' ? deliveryFee : 0);

                if (ui.currentPaymentMethod === 'cash') {
                    const received = parseFloat(App.DOM.cashReceivedInput.value) || 0;
                    if (received < total) return App.utils.showNotification(`Valor insuficiente.`, 'error');
                }
                
                if (deliveryMode === 'entrega' && deliveryFee <= 0) {
                    if (!confirm('O Valor da Entrega está R$ 0,00. Deseja continuar mesmo assim?')) {
                        return; 
                    }
                }
                if (deliveryMode === 'entrega' && (!customerName || !customerAddress)) {
                    if (!confirm('O nome do cliente ou endereço não foi preenchido. Deseja continuar mesmo assim?')) {
                        return; 
                    }
                }
                
                const deliveryInfo = {
                    mode: deliveryMode,
                    name: customerName,
                    address: customerAddress,
                    fee: deliveryFee
                };
                
                const sale = {
                    id: Date.now(), date: new Date().toLocaleString('pt-BR'), dateKey: ui.today,
                    items: [...cart], 
                    total: total, 
                    paymentMethod: ui.currentPaymentMethod,
                    cashReceived: ui.currentPaymentMethod === 'cash' ? (parseFloat(App.DOM.cashReceivedInput.value) || 0) : null,
                    change: ui.currentPaymentMethod === 'cash' ? ((parseFloat(App.DOM.cashReceivedInput.value) || 0) - total) : null,
                    openTimeMinutes: 0,
                    deliveryInfo: deliveryInfo 
                };
                
                if (!salesHistory[ui.today]) salesHistory[ui.today] = [];
                salesHistory[ui.today].unshift(sale);
                App.storage.saveSalesHistory();
                App.utils.showNotification(`Venda finalizada!`, 'success');
                App.render.history(ui.today); 
                ui.lastSaleForReceipt = sale;
                App.utils.showReceiptModal(sale);
                this.resetSaleState();
            },

            resetSaleState() {
                App.state.cart = [];
                App.state.ui.currentPaymentMethod = null;
                App.DOM.confirmPaymentButton.style.display = 'none';
                App.DOM.cashInputSection.style.display = 'none';
                App.DOM.cashReceivedInput.value = '';
                App.DOM.changeDisplay.style.display = 'none';
                App.DOM.changeAmount.textContent = '0,00';
                document.querySelectorAll('#venda-tab .payment-option').forEach(el => el.classList.remove('selected'));
                
                App.handlers.selectDeliveryMode('balcao');
                App.DOM.deliveryCustomerName.value = '';
                App.DOM.deliveryCustomerAddress.value = '';
                App.DOM.deliveryFee.value = ''; 
                
                App.render.cart(); 
            },
            cancelSale() {
                if (App.state.cart.length > 0 && confirm('Tem certeza que deseja cancelar a venda?')) {
                    this.resetSaleState(); 
                    App.utils.showNotification('Venda cancelada.', 'warning');
                }
            },
            
            requestHoldSale() {
                if (App.state.cart.length === 0) {
                    return App.utils.showNotification('Carrinho vazio.', 'error');
                }
                
                const { existingOrderSelect } = App.DOM;
                existingOrderSelect.innerHTML = '<option value="new">Salvar como nova comanda</option>';
                App.state.openOrders.forEach(order => {
                    const option = document.createElement('option');
                    option.value = order.id;
                    option.textContent = `${order.customerName} (R$ ${order.total.toFixed(2)})`;
                    existingOrderSelect.appendChild(option);
                });
                
                App.DOM.customerNameInput.value = App.DOM.deliveryCustomerName.value;
                App.DOM.holdSaleModal.style.display = 'flex';
                App.DOM.customerNameInput.focus();
            },
            
            saveHoldSale() {
                const { customerNameInput, existingOrderSelect } = App.DOM;
                const customerName = customerNameInput.value.trim();
                const selectedOrderId = existingOrderSelect.value;
                
                if (selectedOrderId === 'new' && !customerName) {
                    return App.utils.showNotification('Digite um nome para a nova comanda.', 'error');
                }
                
                const deliveryInfo = {
                    mode: App.state.ui.deliveryMode,
                    name: App.DOM.deliveryCustomerName.value,
                    address: App.DOM.deliveryCustomerAddress.value,
                    fee: parseFloat(App.DOM.deliveryFee.value) || 0
                };
                
                if (selectedOrderId === 'new') {
                    const subtotal = App.state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
                    const total = subtotal + (deliveryInfo.mode === 'entrega' ? deliveryInfo.fee : 0);

                    const newOrder = {
                        id: Date.now(),
                        customerName: customerName,
                        items: [...App.state.cart],
                        total: total,
                        createdAt: new Date().toISOString(),
                        deliveryInfo: deliveryInfo 
                    };
                    App.state.openOrders.push(newOrder);
                    App.utils.showNotification(`Nova comanda salva para "${customerName}".`, 'success');
                } else {
                    const orderId = parseInt(selectedOrderId);
                    const order = App.state.openOrders.find(o => o.id === orderId);
                    if (order) {
                        order.items.push(...App.state.cart);
                        const itemsTotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
                        const fee = (order.deliveryInfo && order.deliveryInfo.mode === 'entrega') ? order.deliveryInfo.fee : 0;
                        order.total = itemsTotal + fee;
                        App.utils.showNotification(`Itens adicionados à comanda de "${order.customerName}".`, 'success');
                    }
                }
                
                App.storage.saveOpenOrders();
                App.render.openOrdersGrid();
                App.handlers.resetSaleState();
                App.DOM.holdSaleModal.style.display = 'none';
            },
            
            openOrderDetails(orderId) {
                const order = App.state.openOrders.find(o => o.id === orderId);
                if (!order) return;
                
                App.state.ui.currentOpenOrder = order;
                App.state.ui.openOrderPaymentMethod = null;

                App.DOM.openOrderTitle.textContent = `Comanda: ${order.customerName}`;
                App.DOM.openOrderTotal.textContent = `R$ ${order.total.toFixed(2)}`;
                App.DOM.openOrderCashReceived.value = '';
                App.DOM.openOrderChangeDisplay.style.display = 'none';
                App.DOM.openOrderCashInput.style.display = 'none';
                App.DOM.openOrderPaymentOptions.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
                
                App.render.openOrderItems(order.items, order.deliveryInfo); 
                
                if (App.state.ui.openOrderTimerInterval) {
                    clearInterval(App.state.ui.openOrderTimerInterval);
                }
                const startTime = new Date(order.createdAt).getTime();
                App.state.ui.openOrderTimerInterval = setInterval(() => {
                    App.render.openOrderTimer(startTime);
                }, 1000);
                App.render.openOrderTimer(startTime);
                
                App.DOM.openOrderModal.style.display = 'flex';
            },
            
            closeOpenOrderModal() {
                if (App.state.ui.openOrderTimerInterval) {
                    clearInterval(App.state.ui.openOrderTimerInterval);
                }
                App.state.ui.currentOpenOrder = null;
                App.state.ui.openOrderTimerInterval = null;
                App.DOM.openOrderModal.style.display = 'none';
            },
            
            selectOpenOrderPaymentMethod(el) {
                App.state.ui.openOrderPaymentMethod = el.dataset.method;
                App.DOM.openOrderPaymentOptions.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
                App.DOM.openOrderCashInput.style.display = (el.dataset.method === 'cash') ? 'block' : 'none';
                this.calculateOpenOrderChange();
            },
            
            calculateOpenOrderChange() {
                const order = App.state.ui.currentOpenOrder;
                if (!order) return;
                
                const received = parseFloat(App.DOM.openOrderCashReceived.value) || 0;
                if (received >= order.total) {
                    App.DOM.openOrderChangeAmount.textContent = (received - order.total).toFixed(2);
                    App.DOM.openOrderChangeDisplay.style.display = 'block';
                } else {
                    App.DOM.openOrderChangeDisplay.style.display = 'none';
                }
            },
            
            finalizeOpenOrderPayment() {
                const { ui, salesHistory } = App.state;
                const order = ui.currentOpenOrder;
                const paymentMethod = ui.openOrderPaymentMethod;
                
                if (!order) return App.utils.showNotification('Erro: Nenhuma comanda selecionada.', 'error');
                if (!paymentMethod) return App.utils.showNotification('Selecione uma forma de pagamento.', 'error');
                
                const deliveryInfo = order.deliveryInfo || { mode: 'balcao', name: '', address: '', fee: 0 };
                
                if (deliveryInfo.mode === 'entrega' && (!deliveryInfo.fee || deliveryInfo.fee <= 0)) {
                    if (!confirm('Esta comanda de entrega está com a taxa R$ 0,00. Deseja continuar mesmo assim?')) {
                        return; 
                    }
                }
                if (deliveryInfo.mode === 'entrega' && (!deliveryInfo.name || !deliveryInfo.address)) {
                     if (!confirm('Esta comanda de entrega não tem nome ou endereço. Deseja continuar mesmo assim?')) {
                        return; 
                    }
                }

                let cashReceived = null;
                let change = null;
                
                if (paymentMethod === 'cash') {
                    cashReceived = parseFloat(App.DOM.openOrderCashReceived.value) || 0;
                    if (cashReceived < order.total) {
                        return App.utils.showNotification(`Valor insuficiente.`, 'error');
                    }
                    change = cashReceived - order.total;
                }
                
                const startTime = new Date(order.createdAt).getTime();
                const endTime = new Date().getTime();
                const openTimeMinutes = (endTime - startTime) / (1000 * 60);
                
                const sale = {
                    id: order.id, 
                    date: new Date().toLocaleString('pt-BR'), 
                    dateKey: ui.today,
                    items: [...order.items], 
                    total: order.total, 
                    paymentMethod: paymentMethod,
                    cashReceived: cashReceived,
                    change: change,
                    openTimeMinutes: openTimeMinutes,
                    deliveryInfo: deliveryInfo 
                };
                
                if (!salesHistory[ui.today]) salesHistory[ui.today] = [];
                salesHistory[ui.today].unshift(sale);
                App.storage.saveSalesHistory();
                
                App.state.openOrders = App.state.openOrders.filter(o => o.id !== order.id);
                App.storage.saveOpenOrders();
                
                App.utils.showNotification(`Comanda de "${order.customerName}" finalizada!`, 'success');
                App.render.history(ui.today); 
                App.render.openOrdersGrid();
                
                ui.lastSaleForReceipt = sale;
                App.utils.showReceiptModal(sale);
                this.closeOpenOrderModal();
            },

            login() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const isAdmin = (username === 'admin' && password === 'qwe102030');
                const isCreator = (username === 'admcarll' && password === '15243qwe');
                const isBreno = (username === 'brenomacedo' && password === '070824');
                if (isAdmin || isCreator || isBreno) {
                    App.state.ui.isAdminLoggedIn = true;
                    App.DOM.loginSection.style.display = 'none';
                    App.DOM.adminControlsPanel.style.display = 'block';
                    document.getElementById('logged-user').textContent = username; 
                    App.utils.showNotification('Login realizado com sucesso.', 'success');
                } else {
                    App.utils.showNotification('Usuário ou senha incorretos.', 'error');
                }
            },
            logout() {
                App.state.ui.isAdminLoggedIn = false;
                App.DOM.loginSection.style.display = 'block';
                App.DOM.adminControlsPanel.style.display = 'none';
                
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            },
            updateAcaiPrice() {
                if(!App.state.ui.isAdminLoggedIn) return App.utils.showNotification('Acesso negado.', 'error');
                App.state.config.açaíPricePerKg = parseFloat(App.DOM.acaiPriceInput.value);
                App.storage.saveConfig();
                App.render.weightedProductPrice();
                App.utils.showNotification('Preço do açaí atualizado.', 'success');
            },
            updateSorvetePrice() {
                if(!App.state.ui.isAdminLoggedIn) return App.utils.showNotification('Acesso negado.', 'error');
                App.state.config.sorvetePricePerKg = parseFloat(App.DOM.sorvetePriceInput.value);
                App.storage.saveConfig();
                App.render.weightedProductPrice();
                App.utils.showNotification('Preço do sorvete atualizado.', 'success');
            },
            updateDeletePassword() {
                if(!App.state.ui.isAdminLoggedIn) return App.utils.showNotification('Acesso negado.', 'error');
                App.state.config.deletePassword = App.DOM.deletePasswordInput.value;
                App.storage.saveConfig();
                App.utils.showNotification('Senha de exclusão atualizada.', 'success');
            },
            addNewProduct() {
                if (!App.state.ui.isAdminLoggedIn) return App.utils.showNotification('Acesso negado.', 'error');
                const name = App.DOM.newProductName.value.trim();
                const price = parseFloat(App.DOM.newProductPrice.value);
                const category = App.DOM.newProductCategory.value.trim() || 'Geral';
                if (!name || !price || price <= 0) {
                    return App.utils.showNotification('Por favor, preencha nome e preço válidos.', 'error');
                }
                const newProduct = { id: Date.now(), name, price, category, image: "" };
                App.state.products.push(newProduct);
                App.storage.saveProducts();
                App.utils.showNotification(`Produto "${name}" adicionado com sucesso!`, 'success');
                App.DOM.newProductName.value = '';
                App.DOM.newProductPrice.value = '';
                App.DOM.newProductCategory.value = '';
                App.render.products();
                App.render.adminProducts();
                App.render.productCategories();
            },
            deleteProduct(productId) {
                if (!App.state.ui.isAdminLoggedIn) return App.utils.showNotification('Acesso negado.', 'error');
                const idToDelete = parseInt(productId);
                const productIndex = App.state.products.findIndex(p => p.id === idToDelete);
                if (productIndex > -1) {
                    if (confirm(`Tem certeza que deseja excluir o produto "${App.state.products[productIndex].name}"?`)) {
                        const removed = App.state.products.splice(productIndex, 1)[0];
                        App.storage.saveProducts();
                        App.utils.showNotification(`Produto "${removed.name}" excluído.`, 'warning');
                        App.render.products();
                        App.render.adminProducts();
                        App.render.productCategories();
                    }
                }
            },
            
            addNewExpense() {
                const name = App.DOM.newExpenseName.value.trim();
                const description = App.DOM.newExpenseDesc.value.trim();
                const value = parseFloat(App.DOM.newExpenseValue.value);
                const dateKey = App.state.ui.today;
                
                if (!name || !value || value <= 0) {
                    return App.utils.showNotification('Preencha um nome e valor válidos para a despesa.', 'error');
                }
                
                const newExpense = {
                    id: Date.now(),
                    date: new Date().toLocaleString('pt-BR'),
                    dateKey: dateKey,
                    name: name,
                    description: description,
                    value: value
                };
                
                if (!App.state.expenses[dateKey]) {
                    App.state.expenses[dateKey] = [];
                }
                App.state.expenses[dateKey].unshift(newExpense);
                App.storage.saveExpenses();
                
                App.utils.showNotification('Despesa adicionada com sucesso!', 'success');
                
                App.DOM.newExpenseName.value = '';
                App.DOM.newExpenseDesc.value = '';
                App.DOM.newExpenseValue.value = '';
                
                App.DOM.expenseDate.value = dateKey;
                App.render.expenses(dateKey);
                App.render.history(App.DOM.historyDate.value); 
            },
            
            requestDeleteSale(target) {
                App.state.ui.saleToDelete = { id: parseInt(target.dataset.id), date: target.dataset.date };
                App.state.ui.expenseToDelete = null; 
                App.DOM.passwordModal.querySelector('h3').textContent = 'Excluir Venda';
                App.DOM.passwordModal.style.display = 'flex';
                App.DOM.confirmDeletePasswordInput.focus();
            },
            
            // MODIFICADO: Exclui despesas diretamente, sem senha, apenas com confirmação
            requestDeleteExpense(target) {
                const id = parseInt(target.dataset.id);
                const date = target.dataset.date;
                
                const expenseList = App.state.expenses[date];
                if (!expenseList) return;
                const expense = expenseList.find(e => e.id === id);
                
                if (expense && confirm(`Tem certeza que deseja excluir a despesa "${expense.name}"?`)) {
                     const expenseIndex = expenseList.indexOf(expense);
                     if (expenseIndex > -1) {
                        expenseList.splice(expenseIndex, 1);
                        App.storage.saveExpenses();
                        App.render.expenses(date); 
                        App.render.history(App.DOM.historyDate.value); 
                        App.utils.showNotification('Despesa excluída.', 'success');
                     }
                }
            },

            confirmDelete() {
                if (App.DOM.confirmDeletePasswordInput.value !== App.state.config.deletePassword) {
                    App.utils.showNotification('Senha incorreta.', 'error');
                    App.DOM.passwordModal.style.display = 'none';
                    App.DOM.confirmDeletePasswordInput.value = '';
                    return;
                }
                
                if (App.state.ui.saleToDelete) {
                    const {id, date} = App.state.ui.saleToDelete;
                    const saleIndex = App.state.salesHistory[date].findIndex(s => s.id === id);
                    if (saleIndex > -1) {
                        App.state.salesHistory[date].splice(saleIndex, 1);
                        App.storage.saveSalesHistory();
                        App.render.history(date);
                        App.utils.showNotification('Venda excluída.', 'success');
                    }
                }
                
                App.DOM.passwordModal.style.display = 'none';
                App.DOM.confirmDeletePasswordInput.value = '';
                App.state.ui.saleToDelete = null;
                // expenseToDelete não é mais usado no modal
            },
            
            reprintSale(target) {
                const id = parseInt(target.dataset.id);
                const date = target.dataset.date;
                
                if (!id || !date || !App.state.salesHistory[date]) {
                    return App.utils.showNotification("Erro ao localizar venda.", "error");
                }
                
                const saleToReprint = App.state.salesHistory[date].find(s => s.id === id);
                
                if (saleToReprint) {
                    App.handlers.printReceipt(saleToReprint);
                } else {
                    App.utils.showNotification("Venda não encontrada.", "error");
                }
            },
            
            openManualSaleModal() {
                App.state.manualSaleCart = [];
                App.state.ui.manualSalePaymentMethod = null;
                App.render.manualSaleCart();
                App.DOM.manualProductSelect.innerHTML = '<option value="">Selecione...</option><option value="acai_kg">Açaí por KG</option><option value="sorvete_kg">Sorvete por KG</option>';
                App.state.products.forEach(p => {
                    App.DOM.manualProductSelect.innerHTML += `<option value="${p.id}">${p.name} - R$ ${p.price.toFixed(2)}</option>`;
                });
                App.DOM.manualAcaiWeightSection.style.display = 'none';
                document.querySelectorAll('#manual-payment-options .payment-option').forEach(el => el.classList.remove('selected'));
                App.DOM.manualSaleModal.style.display = 'flex';
            },
            toggleManualWeightInput(e) {
                App.DOM.manualAcaiWeightSection.style.display = (e.target.value === 'acai_kg' || e.target.value === 'sorvete_kg') ? 'grid' : 'none';
            },
            addManualItem() {
                const selectedId = App.DOM.manualProductSelect.value;
                if (!selectedId) return;
                if (selectedId === 'acai_kg' || selectedId === 'sorvete_kg') {
                    const weight = parseFloat(App.DOM.manualAcaiWeightInput.value);
                    if (!weight || weight <= 0) return App.utils.showNotification('Digite um peso válido.', 'error');
                    const isAcai = selectedId === 'acai_kg';
                    const pricePerKg = isAcai ? App.state.config.açaíPricePerKg : App.state.config.sorvetePricePerKg;
                    const name = isAcai ? "Açaí por KG" : "Sorvete por KG";
                    const price = (weight / 1000) * pricePerKg;
                    App.state.manualSaleCart.push({ id: Date.now(), name, weightGrams: weight, totalPrice: price, type: 'weight' });
                } else {
                    const product = App.state.products.find(p => p.id === parseInt(selectedId));
                    if (product) App.state.manualSaleCart.push({ id: Date.now(), name: product.name, totalPrice: product.price, type: 'product' });
                }
                App.render.manualSaleCart();
            },
            removeManualItem(index) {
                App.state.manualSaleCart.splice(index, 1);
                App.render.manualSaleCart();
            },
            selectManualPaymentMethod(el) {
                App.state.ui.manualSalePaymentMethod = el.dataset.method;
                document.querySelectorAll('#manual-payment-options .payment-option').forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
            },
            saveManualSale() {
                const saleDate = App.DOM.historyDate.value;
                if (App.state.manualSaleCart.length === 0) return App.utils.showNotification('Adicione itens à venda.', 'error');
                if (!App.state.ui.manualSalePaymentMethod) return App.utils.showNotification('Selecione um método de pagamento.', 'error');
                const total = App.state.manualSaleCart.reduce((sum, item) => sum + item.totalPrice, 0);
                
                const sale = {
                    id: Date.now(), date: new Date(saleDate + 'T12:00:00').toLocaleString('pt-BR'), dateKey: saleDate,
                    items: [...App.state.manualSaleCart], total, paymentMethod: App.state.ui.manualSalePaymentMethod,
                    openTimeMinutes: 0,
                    deliveryInfo: { mode: 'balcao', name: '', address: '', fee: 0 } 
                };
                
                if (!App.state.salesHistory[saleDate]) App.state.salesHistory[saleDate] = [];
                App.state.salesHistory[saleDate].unshift(sale);
                App.storage.saveSalesHistory();
                App.utils.showNotification('Venda manual salva com sucesso!', 'success');
                App.render.history(saleDate);
                App.DOM.manualSaleModal.style.display = 'none';
            },
            
            exportHistoryToPDF() {
                const date = App.DOM.historyDate.value;
                const salesForDate = App.state.salesHistory[date] || [];
                const expensesForDate = App.state.expenses[date] || []; 
                
                if (salesForDate.length === 0 && expensesForDate.length === 0) { 
                    return App.utils.showNotification('Nenhuma venda ou despesa para exportar nesta data.', 'warning');
                }
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR');
                let finalY = 22;
                
                doc.setFontSize(18);
                doc.text(`Relatório Diário - ${formattedDate}`, 14, finalY);
                finalY += 10;
                
                let totalGeral = 0;
                let totalProdutos = 0;
                let totalEntregas = 0;
                let totalDespesas = 0; 
                
                if (salesForDate.length > 0) {
                    doc.setFontSize(14);
                    doc.text('Vendas do Dia', 14, finalY);
                    finalY += 8;
                    
                    const tableColumn = ["Hora", "Itens", "Pagamento", "Total (R$)"];
                    const tableRows = [];

                    salesForDate.forEach(sale => {
                        let itemsString = sale.items.map(i => {
                            const detail = i.weightGrams ? `(${i.weightGrams}g)` : '';
                            return `- ${i.name} ${detail} [R$ ${i.totalPrice.toFixed(2)}]`;
                        }).join('\n');
                        
                        if (sale.openTimeMinutes && sale.openTimeMinutes > 0) {
                            itemsString += `\n(Aberta por: ${sale.openTimeMinutes.toFixed(0)} min)`;
                        }
                        
                        const taxaEntrega = (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega' && sale.deliveryInfo.fee > 0) ? sale.deliveryInfo.fee : 0;
                        const valorProdutos = sale.total - taxaEntrega;

                        if (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega') {
                             const fee = sale.deliveryInfo.fee ? ` (Taxa: R$ ${sale.deliveryInfo.fee.toFixed(2)})` : '';
                             itemsString += `\n(Entrega: ${sale.deliveryInfo.name || 'N/A'}${fee})`;
                        }

                        let paymentString = App.utils.getPaymentMethodName(sale.paymentMethod);
                        if (sale.paymentMethod === 'cash' && sale.change > 0) {
                            paymentString += `\n(Troco: R$ ${sale.change.toFixed(2)})`;
                        }

                        const saleData = [
                            sale.date.split(' ')[1],
                            itemsString,
                            paymentString,
                            sale.total.toFixed(2)
                        ];
                        tableRows.push(saleData);
                        
                        totalGeral += sale.total;
                        totalProdutos += valorProdutos;
                        totalEntregas += taxaEntrega;
                    });
                    
                    doc.autoTable({
                        head: [tableColumn],
                        body: tableRows,
                        startY: finalY,
                        styles: { cellPadding: 2, fontSize: 8, halign: 'left', valign: 'top' },
                        headStyles: { fillColor: [138, 43, 226], halign: 'center' },
                        alternateRowStyles: { fillColor: [245, 245, 245] },
                        columnStyles: {
                           0: { halign: 'center', cellWidth: 20 },
                           1: { cellWidth: 80 },
                           2: { halign: 'center', cellWidth: 30 },
                           3: { halign: 'right', cellWidth: 25 }
                        }
                    });
                    finalY = doc.lastAutoTable.finalY;
                }
                
                if (expensesForDate.length > 0) {
                    finalY += 10;
                    doc.setFontSize(14);
                    doc.text('Despesas do Dia', 14, finalY);
                    finalY += 8;
                    
                    const expenseTableColumn = ["Hora", "Nome", "Descrição", "Valor (R$)"];
                    const expenseTableRows = [];
                    
                    expensesForDate.forEach(expense => {
                        expenseTableRows.push([
                            expense.date.split(' ')[1],
                            expense.name,
                            expense.description || '-',
                            // Valor Positivo
                            `R$ ${expense.value.toFixed(2)}`
                        ]);
                        totalDespesas += expense.value;
                    });
                    
                    doc.autoTable({
                        head: [expenseTableColumn],
                        body: expenseTableRows,
                        startY: finalY,
                        styles: { cellPadding: 2, fontSize: 8, halign: 'left', valign: 'top' },
                        headStyles: { fillColor: [220, 53, 69], halign: 'center' }, 
                        alternateRowStyles: { fillColor: [245, 245, 245] },
                        columnStyles: {
                           0: { halign: 'center', cellWidth: 20 },
                           1: { cellWidth: 60 },
                           2: { cellWidth: 60 },
                           3: { halign: 'right', cellWidth: 25 }
                        }
                    });
                    finalY = doc.lastAutoTable.finalY;
                }
                
                finalY += 10;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(`Total em Produtos: R$ ${totalProdutos.toFixed(2)}`, 14, finalY);
                doc.text(`Total em Entregas: R$ ${totalEntregas.toFixed(2)}`, 14, finalY + 5);
                
                doc.setTextColor(220, 53, 69); 
                doc.text(`Total em Despesas: R$ ${totalDespesas.toFixed(2)}`, 14, finalY + 10);
                doc.setTextColor(0, 0, 0); 
                
                // Saldo do Dia = Receita Bruta
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text(`Total de Vendas do Dia: R$ ${totalGeral.toFixed(2)}`, 14, finalY + 17);

                doc.save(`relatorio_diario_${date}.pdf`);
                App.utils.showNotification('PDF diário gerado com sucesso!', 'success');
            },
            
            exportMonthlyReportToPDF() {
                const monthYear = App.DOM.reportMonthSelect.value; 
                if (!monthYear) {
                    return App.utils.showNotification('Selecione um mês válido.', 'error');
                }
                
                const [year, month] = monthYear.split('-');
                
                const allSales = [];
                const allExpenses = [];
                
                Object.keys(App.state.salesHistory).forEach(dateKey => {
                    if (dateKey.startsWith(monthYear)) {
                        allSales.push(...App.state.salesHistory[dateKey]);
                    }
                });
                
                Object.keys(App.state.expenses).forEach(dateKey => {
                    if (dateKey.startsWith(monthYear)) {
                        allExpenses.push(...App.state.expenses[dateKey]);
                    }
                });
                
                if (allSales.length === 0 && allExpenses.length === 0) {
                    return App.utils.showNotification('Nenhum dado encontrado para este mês.', 'warning');
                }

                let totalVendas = 0;
                let totalEntregas = 0;
                let totalProdutos = 0;
                let totalDespesas = 0;
                let pagamentos = { cash: 0, card: 0, pix: 0 };
                
                allSales.forEach(sale => {
                    const taxaEntrega = (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega' && sale.deliveryInfo.fee > 0) ? sale.deliveryInfo.fee : 0;
                    totalVendas += sale.total;
                    totalEntregas += taxaEntrega;
                    totalProdutos += (sale.total - taxaEntrega);
                    
                    if (pagamentos.hasOwnProperty(sale.paymentMethod)) {
                        pagamentos[sale.paymentMethod] += sale.total;
                    }
                });
                
                allExpenses.forEach(expense => {
                    totalDespesas += expense.value;
                });
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const formattedMonth = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                let finalY = 22;
                
                doc.setFontSize(18);
                doc.text(`Relatório Mensal - ${formattedMonth}`, 14, finalY);
                finalY += 10;
                
                doc.setFontSize(14);
                doc.text('Resumo Geral do Mês', 14, finalY);
                finalY += 8;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                
                doc.text(`Total de Vendas (Produtos + Entregas):`, 14, finalY);
                doc.text(`R$ ${totalVendas.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 6;
                
                doc.text(`Total em Despesas:`, 14, finalY);
                doc.setTextColor(220, 53, 69); 
                // Valor positivo visualmente
                doc.text(`R$ ${totalDespesas.toFixed(2)}`, 150, finalY, { align: 'right' });
                doc.setTextColor(0, 0, 0); 
                finalY += 6;
                
                doc.setFont(undefined, 'bold');
                doc.text(`Total Líquido (Vendas - Despesas):`, 14, finalY);
                doc.text(`R$ ${(totalVendas - totalDespesas).toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 10;
                
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('Detalhes de Vendas', 14, finalY);
                finalY += 7;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                
                doc.text(`Total em Produtos:`, 20, finalY);
                doc.text(`R$ ${totalProdutos.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 6;
                
                doc.text(`Total em Entregas:`, 20, finalY);
                doc.text(`R$ ${totalEntregas.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 8;
                
                doc.text(`Total por Pagamento:`, 14, finalY);
                finalY += 6;
                doc.text(`Dinheiro:`, 20, finalY);
                doc.text(`R$ ${pagamentos.cash.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 6;
                doc.text(`Cartão:`, 20, finalY);
                doc.text(`R$ ${pagamentos.card.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 6;
                doc.text(`PIX:`, 20, finalY);
                doc.text(`R$ ${pagamentos.pix.toFixed(2)}`, 150, finalY, { align: 'right' });
                finalY += 10;

                if (allExpenses.length > 0) {
                    doc.setFontSize(12);
                    doc.setFont(undefined, 'bold');
                    doc.text('Lista de Despesas do Mês', 14, finalY);
                    finalY += 7;
                    
                    const expenseTableColumn = ["Data", "Nome", "Descrição", "Valor (R$)"];
                    const expenseTableRows = [];
                    
                    allExpenses.sort((a, b) => new Date(a.dateKey + 'T' + a.date.split(' ')[1]) - new Date(b.dateKey + 'T' + b.date.split(' ')[1]));
                    
                    allExpenses.forEach(expense => {
                        expenseTableRows.push([
                            new Date(expense.dateKey + 'T12:00:00').toLocaleDateString('pt-BR'),
                            expense.name,
                            expense.description || '-',
                            `R$ ${expense.value.toFixed(2)}`
                        ]);
                    });
                    
                    doc.autoTable({
                        head: [expenseTableColumn],
                        body: expenseTableRows,
                        startY: finalY,
                        styles: { cellPadding: 2, fontSize: 8, halign: 'left', valign: 'top' },
                        headStyles: { fillColor: [220, 53, 69], halign: 'center' }, 
                        alternateRowStyles: { fillColor: [245, 245, 245] },
                        columnStyles: {
                           0: { halign: 'center', cellWidth: 25 },
                           1: { cellWidth: 60 },
                           2: { cellWidth: 60 },
                           3: { halign: 'right', cellWidth: 25 }
                        }
                    });
                    finalY = doc.lastAutoTable.finalY;
                }

                doc.save(`relatorio_mensal_${monthYear}.pdf`);
                App.utils.showNotification('PDF mensal gerado com sucesso!', 'success');
            },
            
            printLastReceiptModal() {
                const sale = App.state.ui.lastSaleForReceipt;
                if (sale) {
                    App.handlers.printReceipt(sale);
                } else {
                    App.utils.showNotification("Nenhuma venda recente para imprimir.", "error");
                }
            },
            
            printReceipt(sale) {
                if (!sale) return App.utils.showNotification("Não foi possível encontrar a venda para imprimir.", "error");
                
                let deliveryHtml = '';
                const fee = (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega' && sale.deliveryInfo.fee > 0) ? sale.deliveryInfo.fee : 0;
                const feeHtml = fee > 0 ? `<div class="item"><span class="item-name">Taxa Entrega</span><span class="item-price">R$ ${fee.toFixed(2)}</span></div>` : '';

                if (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega') {
                    deliveryHtml = `
                        <div class="divider"></div>
                        <div class="item" style="text-align: center; display: block; margin-bottom: 5px;"><strong>*** ENTREGA ***</strong></div>
                        ${sale.deliveryInfo.name ? `<div class="item"><span>Cliente:</span><span style="text-align:right;">${sale.deliveryInfo.name}</span></div>` : ''}
                        ${sale.deliveryInfo.address ? `<div class="item"><span>Endereço:</span><span style="text-align:right;">${sale.deliveryInfo.address}</span></div>` : ''}
                    `;
                }
                
                const printContent = `<!DOCTYPE html><html><head><title>Recibo</title><style>
                    @page{ size: 78mm auto; margin: 0; padding: 0; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        color: #000;
                        font-weight: bold;
                        width: 78mm; 
                        margin: 0;
                        padding: 5px 5px 20px 5px;
                        box-sizing: border-box;
                        background: #fff;
                    }
                    .header{text-align:center;margin-bottom:8px;padding-bottom:5px;border-bottom:1px dashed #000}
                    .header h2{font-size:16px;font-weight:700;margin:5px 0;text-transform:uppercase}
                    .header p{margin:3px 0;font-size:10px}
                    .item{display:flex;justify-content:space-between;margin-bottom:4px;line-height:1.3}
                    .item-name{flex-grow:1;text-align:left;word-break:break-word}
                    .item-price{width:80px;text-align:right;flex-shrink:0; display:flex; flex-direction:column;}
                    .discount-tag{font-size:9px; font-style:italic;}
                    .old-price-print{text-decoration: line-through; font-size: 10px;}
                    .divider{border-top:1px dashed #000;margin:8px 0}
                    .total{font-weight:700;margin-top:8px;font-size:14px}
                    .payment-info{margin:8px 0;font-size:10px}
                    .footer{text-align:center;margin-top:10px;font-size:9px;border-top:1px dashed #000;padding-top:5px}
                    @media print{
                        body {
                            margin: 0;
                            padding: 5px 5px 20px 5px;
                            width: 78mm; 
                            color: #000 !important;
                            font-weight: bold !important;
                            -webkit-print-color-adjust: exact;
                        }
                    }
                    </style></head><body>
                    <div class="header"><h2>Açaí da Serra</h2><p>${new Date().toLocaleString('pt-BR')}</p></div>
                    ${deliveryHtml} 
                    <div class="divider"></div>
                    ${sale.items.map(item => {
                        let priceHtml = `<span>R$ ${item.totalPrice.toFixed(2)}</span>`;
                        let nameExtra = "";
                        
                        if (item.originalPrice && item.discountInfo) {
                             priceHtml = `<span class="old-price-print">R$ ${item.originalPrice.toFixed(2)}</span><span>R$ ${item.totalPrice.toFixed(2)}</span>`;
                             nameExtra = `<br><span class="discount-tag">(-${item.discountInfo.percentage}%)</span>`;
                        }

                        return `<div class="item">
                            <span class="item-name">${item.name} ${item.weightGrams ? `(${item.weightGrams}g)` : ''}${nameExtra}</span>
                            <span class="item-price">${priceHtml}</span>
                        </div>`
                    }).join('')}
                    ${feeHtml}
                    <div class="divider"></div>
                    <div class="item total"><span>TOTAL:</span><span>R$ ${sale.total.toFixed(2)}</span></div>
                    <div class="payment-info">
                        <div class="item"><span>Pagamento:</span><span>${App.utils.getPaymentMethodName(sale.paymentMethod)}</span></div>
                        ${sale.paymentMethod === 'cash' ? `<div class="item"><span>Recebido:</span><span>R$ ${sale.cashReceived.toFixed(2)}</span></div><div class="item"><span>Troco:</span><span>R$ ${sale.change.toFixed(2)}</span></div>` : ''}
                    </div>
                    <div class="footer"><p>Obrigado pela preferência!</p><p>Volte Sempre!</p></div>
                    <script>window.onload=()=>{setTimeout(()=>{window.print();setTimeout(()=>window.close(),100)},100)}<\/script>
                </body></html>`;
                
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printContent);
                printWindow.document.close();
            },
        },

        render: {
            all() {
                App.DOM.currentDate.textContent = new Date().toLocaleDateString('pt-BR');
                App.DOM.historyDate.value = App.state.ui.today;
                App.DOM.expenseDate.value = App.state.ui.today; 
                App.DOM.acaiPriceInput.value = App.state.config.açaíPricePerKg.toFixed(2);
                App.DOM.sorvetePriceInput.value = App.state.config.sorvetePricePerKg.toFixed(2);
                App.DOM.deletePasswordInput.value = App.state.config.deletePassword;
                this.weightedProductPrice();
                this.cart();
                this.productCategories();
                this.products();
                this.history(App.state.ui.today);
                this.expenses(App.state.ui.today); 
                this.adminProducts();
                this.openOrdersGrid();
                this.deliveryMode(); 
            },
            discountControls() {
                const { active, percentage, targets } = App.state.discount;
                App.DOM.discountActiveCheck.checked = active;
                App.DOM.discountPercentageInput.value = percentage;
                App.DOM.discountTargetAcai.checked = targets.acai;
                App.DOM.discountTargetSorvete.checked = targets.sorvete;
                
                if (active) {
                    App.DOM.discountConfigArea.classList.remove('disabled');
                } else {
                    App.DOM.discountConfigArea.classList.add('disabled');
                }
            },
            activeDiscountIndicator() {
                const { active, percentage, targets } = App.state.discount;
                if (active) {
                    let items = [];
                    if (targets.acai) items.push("Açaí");
                    if (targets.sorvete) items.push("Sorvete");
                    
                    if (items.length > 0) {
                        App.DOM.discountBalloon.style.display = 'flex';
                        App.DOM.discountDetails.textContent = `${percentage}% OFF em ${items.join(' e ')}`;
                    } else {
                        App.DOM.discountBalloon.style.display = 'none';
                    }
                } else {
                    App.DOM.discountBalloon.style.display = 'none';
                }
            },

            cart() {
                const { cartItems, subtotal, total } = App.DOM;
                cartItems.innerHTML = '';
                
                let currentSubtotal = 0;
                if (App.state.cart.length > 0) {
                    App.state.cart.forEach((item, index) => {
                        currentSubtotal += item.totalPrice;
                        const itemElement = document.createElement('div');
                        itemElement.className = 'cart-item';
                        const details = (item.type === "weight") ? `<div class="item-weight">${item.weightGrams}g</div>` : '';
                        
                        let priceDisplay = `<div class="item-price">R$ ${item.totalPrice.toFixed(2)}</div>`;
                        if (item.originalPrice) {
                            priceDisplay = `
                                <div class="item-price-container">
                                    <span class="old-price">R$ ${item.originalPrice.toFixed(2)}</span>
                                    <span class="item-price">R$ ${item.totalPrice.toFixed(2)}</span>
                                </div>
                            `;
                        }

                        itemElement.innerHTML = `
                            <div class="item-info">
                                <div class="item-quantity">${index + 1}</div>
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    ${details}
                                </div>
                            </div>
                            ${priceDisplay}
                            <div class="item-actions">
                                <button class="btn-small btn-remove" data-index="${index}">✕</button>
                            </div>
                        `;
                        cartItems.appendChild(itemElement);
                    });
                } else {
                     cartItems.innerHTML = '<div class="empty-state">Carrinho vazio</div>';
                }
                
                let deliveryFee = 0;
                if (App.state.ui.deliveryMode === 'entrega') {
                    deliveryFee = parseFloat(App.DOM.deliveryFee.value) || 0;
                }
                const currentTotal = currentSubtotal + deliveryFee;
                
                subtotal.textContent = `R$ ${currentSubtotal.toFixed(2)}`;
                total.textContent = `R$ ${currentTotal.toFixed(2)}`;
            },
            products() {
                const searchTerm = App.DOM.productSearch.value.toLowerCase();
                const activeCategoryEl = App.DOM.productsCategoriesList.querySelector('.category-btn.active');
                const activeCategory = activeCategoryEl ? activeCategoryEl.dataset.category : 'all';
                let filtered = [...App.state.products];
                if (activeCategory !== 'all') filtered = filtered.filter(p => p.category === activeCategory);
                if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
                
                App.DOM.productsGrid.innerHTML = '';
                if (filtered.filter(p => p.category !== 'Bebidas').length === 0) {
                    App.DOM.productsGrid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;">Nenhum produto encontrado.</div>';
                }
                filtered.filter(p => p.category !== 'Bebidas').forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    const imageHtml = product.image ? `<img src="${product.image}" alt="${product.name}">` : '';
                    card.innerHTML = `<div class="product-image">${imageHtml}</div><div class="product-details"><div class="product-name">${product.name}</div><div class="product-price-card">R$ ${product.price.toFixed(2)}</div></div>`;
                    card.addEventListener('click', () => App.handlers.addProductToCart(product));
                    App.DOM.productsGrid.appendChild(card);
                });

                const quickAddButtons = document.querySelector('.quick-add-buttons');
                quickAddButtons.innerHTML = '';
                 filtered.filter(p => p.category === 'Bebidas').forEach(product => {
                    const button = document.createElement('button');
                    button.className = 'quick-add-btn';
                    button.dataset.productId = product.id;
                    button.innerHTML = `${product.name} <span class="price">R$ ${product.price.toFixed(2)}</span>`;
                    button.addEventListener('click', (e) => App.handlers.addQuickProduct(e));
                    quickAddButtons.appendChild(button);
                });
            },
            productCategories() {
                const categories = ['all', ...new Set(App.state.products.map(p => p.category))];
                App.DOM.productsCategoriesList.innerHTML = categories.map(c => `<button class="category-btn ${c==='all'?'active':''}" data-category="${c}">${c==='all'?'Todos':c}</button>`).join('');
                App.DOM.productsCategoriesList.querySelectorAll('.category-btn').forEach(b => b.addEventListener('click', () => {
                    const currentActive = App.DOM.productsCategoriesList.querySelector('.category-btn.active');
                    if(currentActive) currentActive.classList.remove('active');
                    b.classList.add('active');
                    this.products();
                }));
            },
            
            history(date) {
                const { salesHistory, historySummary, historyProductsTotal, historyDeliveryTotal, historyExpensesTotal, historyGrandTotal } = App.DOM;
                
                salesHistory.innerHTML = '';
                
                const salesForDate = App.state.salesHistory[date] || [];
                const expensesForDate = App.state.expenses[date] || []; 
                
                let totalGeral = 0;
                let totalProdutos = 0;
                let totalEntregas = 0;
                let totalDespesas = 0; 

                if (salesForDate.length === 0 && expensesForDate.length === 0) {
                    salesHistory.innerHTML = '<div class="empty-state">Nenhuma venda para esta data</div>';
                    historySummary.style.display = 'none'; 
                    return;
                }

                salesForDate.forEach(sale => {
                    const item = document.createElement('div');
                    item.className = 'sale-item';
                    
                    const taxaEntrega = (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega' && sale.deliveryInfo.fee > 0) ? sale.deliveryInfo.fee : 0;
                    const valorProdutos = sale.total - taxaEntrega;
                    
                    totalGeral += sale.total; 
                    totalProdutos += valorProdutos;
                    totalEntregas += taxaEntrega;
                    
                    const itemsHtml = sale.items.map(i => {
                        const detail = i.weightGrams ? `(${i.weightGrams}g)` : '';
                        let extraInfo = '';
                        if (i.discountInfo) {
                            extraInfo = ` [${i.discountInfo.percentage}% OFF]`;
                        }
                        return `<div class="sale-item-detail" style="font-size: 13px;">- ${i.name} ${detail}${extraInfo}</div>`;
                    }).join('');
                    
                    const openTimeHtml = (sale.openTimeMinutes && sale.openTimeMinutes > 0)
                        ? `<div class="sale-open-time">(Aberta por: ${sale.openTimeMinutes.toFixed(0)} min)</div>` 
                        : '';
                    
                    let deliveryHtml = '';
                    if (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega') {
                        const name = sale.deliveryInfo.name ? ` (${sale.deliveryInfo.name})` : '';
                        const fee = sale.deliveryInfo.fee ? ` (Taxa: R$ ${sale.deliveryInfo.fee.toFixed(2)})` : '';
                        deliveryHtml = `<div class="sale-open-time" style="color: var(--info); font-weight: bold;">🚚 Entrega${name}${fee}</div>`;
                    }

                    const paymentDetails = sale.paymentMethod === 'cash' && sale.change > 0
                        ? ` (Troco: R$ ${sale.change.toFixed(2)})`
                        : '';

                    item.innerHTML = `
                        <div class="sale-info">
                            <div class="sale-date">${sale.date}</div>
                            <div class="sale-items">${itemsHtml}${openTimeHtml}${deliveryHtml}</div>
                            <div class="sale-payment">
                                <span class="payment-icon">${App.utils.getPaymentIcon(sale.paymentMethod)}</span> 
                                ${App.utils.getPaymentMethodName(sale.paymentMethod)}${paymentDetails}
                            </div>
                        </div>
                        <div class="sale-total">R$ ${sale.total.toFixed(2)}</div>
                        <button class="reprint-sale" data-id="${sale.id}" data-date="${date}" title="Reimprimir Recibo">🖨️</button>
                        <button class="delete-sale" data-id="${sale.id}" data-date="${date}" title="Excluir Venda">✕</button>
                    `;
                    
                    salesHistory.appendChild(item);
                });
                
                expensesForDate.forEach(expense => {
                    totalDespesas += expense.value;
                });

                const saldoDia = totalGeral; // Apenas total de vendas, sem subtrair despesas

                historyProductsTotal.textContent = `R$ ${totalProdutos.toFixed(2)}`;
                historyDeliveryTotal.textContent = `R$ ${totalEntregas.toFixed(2)}`;
                historyExpensesTotal.textContent = `R$ ${totalDespesas.toFixed(2)}`; 
                historyGrandTotal.textContent = `R$ ${saldoDia.toFixed(2)}`; 
                historySummary.style.display = 'block';
            },
            
            expenses(date) {
                const { expensesHistoryList, expensesSummary, expensesTotalToday } = App.DOM;
                expensesHistoryList.innerHTML = '';
                
                const expensesForDate = App.state.expenses[date] || [];
                let totalDespesas = 0;
                
                if (expensesForDate.length === 0) {
                    expensesHistoryList.innerHTML = '<div class="empty-state">Nenhuma despesa para esta data</div>';
                    expensesSummary.style.display = 'none';
                    return;
                }
                
                expensesForDate.forEach(expense => {
                    totalDespesas += expense.value;
                    const item = document.createElement('div');
                    item.className = 'expense-item'; 
                    
                    item.innerHTML = `
                        <div class="expense-info">
                            <div class="sale-date">${expense.date}</div>
                            <div class="expense-name">${expense.name}</div>
                            ${expense.description ? `<div class="expense-desc">${expense.description}</div>` : ''}
                        </div>
                        <div class="expense-value">R$ ${expense.value.toFixed(2)}</div>
                        <button class="delete-expense" data-id="${expense.id}" data-date="${date}" title="Excluir Despesa">✕</button>
                    `;
                    expensesHistoryList.appendChild(item);
                });
                
                expensesTotalToday.textContent = `R$ ${totalDespesas.toFixed(2)}`;
                expensesSummary.style.display = 'block';
            },
            
            deliveryMode() {
                const mode = App.state.ui.deliveryMode;
                App.DOM.deliveryModeSelector.querySelectorAll('.delivery-mode-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.mode === mode);
                });
                App.DOM.deliveryInfoSection.style.display = (mode === 'entrega') ? 'grid' : 'none';
            },
            
            openOrdersGrid() {
                const { openOrdersGrid, openOrdersCount } = App.DOM;
                openOrdersGrid.innerHTML = '';
                const orders = App.state.openOrders;
                
                if (orders.length === 0) {
                    openOrdersGrid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;">Nenhuma comanda em aberto</div>';
                    openOrdersCount.style.display = 'none';
                    return;
                }
                
                orders.forEach(order => {
                    const card = document.createElement('div');
                    card.className = 'open-order-card';
                    card.dataset.id = order.id;
                    card.innerHTML = `
                        <div class="open-order-icon">📋</div>
                        <div class="open-order-name">${order.customerName}</div>
                        <div class="open-order-total">R$ ${order.total.toFixed(2)}</div>
                    `;
                    openOrdersGrid.appendChild(card);
                });
                
                openOrdersCount.textContent = orders.length;
                openOrdersCount.style.display = 'inline-flex';
            },
            
            openOrderItems(items, deliveryInfo) {
                const { openOrderItemsList } = App.DOM;
                openOrderItemsList.innerHTML = '';
                if (items.length === 0) {
                    openOrderItemsList.innerHTML = '<div class="empty-state">Nenhum item</div>';
                    return;
                }
                items.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    const details = (item.type === "weight") ? `<div class="item-weight">${item.weightGrams}g</div>` : '';
                    itemElement.innerHTML = `
                        <div class="item-info">
                            <div class="item-quantity">${index + 1}</div>
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                ${details}
                            </div>
                        </div>
                        <div class="item-price">R$ ${item.totalPrice.toFixed(2)}</div>
                    `;
                    openOrderItemsList.appendChild(itemElement);
                });
                
                if (deliveryInfo && deliveryInfo.mode === 'entrega' && deliveryInfo.fee > 0) {
                    const feeElement = document.createElement('div');
                    feeElement.className = 'cart-item';
                    feeElement.innerHTML = `
                        <div class="item-info">
                            <div class="item-quantity"></div>
                            <div class="item-details">
                                <div class="item-name" style="font-weight: bold;">Taxa Entrega</div>
                            </div>
                        </div>
                        <div class="item-price" style="font-weight: bold;">R$ ${deliveryInfo.fee.toFixed(2)}</div>
                    `;
                    openOrderItemsList.appendChild(feeElement);
                }
            },
            
            openOrderTimer(startTime) {
                const now = new Date().getTime();
                const diff = now - startTime;
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                App.DOM.openOrderTimer.textContent = `Aberta por: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            },
            
            adminProducts() {
                App.DOM.productsManagement.innerHTML = '';
                App.state.products.forEach(product => {
                    const control = document.createElement('div');
                    control.className = 'admin-controls';
                    control.innerHTML = `
                        <label>${product.name}</label>
                        <input type="number" class="admin-input product-price-input" data-id="${product.id}" value="${product.price.toFixed(2)}" step="0.01">
                    `;

                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = 'grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;';

                    const updateBtn = document.createElement('button');
                    updateBtn.className = 'touch-btn btn-primary';
                    updateBtn.style.cssText = 'height: auto; padding: 10px; font-size: 1rem;';
                    updateBtn.textContent = 'Atualizar';
                    updateBtn.addEventListener('click', () => {
                        if(!App.state.ui.isAdminLoggedIn) return;
                        const priceInput = control.querySelector(`.product-price-input`);
                        const newPrice = parseFloat(priceInput.value);
                        const productIndex = App.state.products.findIndex(p => p.id === product.id);
                        if (newPrice >= 0 && productIndex !== -1) {
                            App.state.products[productIndex].price = newPrice;
                            App.storage.saveProducts();
                            App.utils.showNotification(`Preço de ${App.state.products[productIndex].name} atualizado.`, 'success');
                            this.products();
                            this.adminProducts();
                            this.productCategories();
                        } else App.utils.showNotification('Preço inválido.', 'error');
                    });

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'touch-btn btn-danger delete-product-btn';
                    deleteBtn.style.cssText = 'height: auto; padding: 10px; font-size: 1rem;';
                    deleteBtn.textContent = 'Excluir';
                    deleteBtn.dataset.id = product.id;

                    buttonContainer.appendChild(updateBtn);
                    buttonContainer.appendChild(deleteBtn);
                    control.appendChild(buttonContainer);
                    App.DOM.productsManagement.appendChild(control);
                });
            },
             manualSaleCart() {
                const { manualSaleCartItems, manualSaleSummary, manualSaleTotal } = App.DOM;
                manualSaleCartItems.innerHTML = '';
                if (App.state.manualSaleCart.length === 0) {
                    manualSaleCartItems.innerHTML = '<div class="empty-state">Nenhum item</div>';
                    manualSaleSummary.style.display = 'none';
                    return;
                }
                let total = 0;
                App.state.manualSaleCart.forEach((item, index) => {
                     total += item.totalPrice;
                     const itemElement = document.createElement('div');
                     itemElement.className = 'cart-item';
                     const details = item.weightGrams ? `<div class="item-weight">${item.weightGrams}g</div>` : '';
                     itemElement.innerHTML = `<div class="item-info"><div class="item-quantity">${index+1}</div><div class="item-details"><div class="item-name">${item.name}</div>${details}</div></div><div class="item-price">R$ ${item.totalPrice.toFixed(2)}</div><button class="btn-small btn-remove" data-index="${index}">✕</button>`;
                     manualSaleCartItems.appendChild(itemElement);
                });
                manualSaleTotal.textContent = `R$ ${total.toFixed(2)}`;
                manualSaleSummary.style.display = 'block';
            },
            weightedProductPrice() {
                const price = App.state.ui.currentWeightedProduct === 'acai'
                    ? App.state.config.açaíPricePerKg
                    : App.state.config.sorvetePricePerKg;
                App.DOM.weightedProductPriceDisplay.textContent = price.toFixed(2);
            },
            weightedProductSelector() {
                if (!App.DOM.productTypeSelector) return;
                App.DOM.productTypeSelector.querySelectorAll('.quick-add-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.type === App.state.ui.currentWeightedProduct);
                });
            },
        },

        utils: {
            getPaymentMethodName: (m) => ({ cash: 'Dinheiro', card: 'Cartão', pix: 'PIX' }[m] || 'N/A'),
            getPaymentIcon: (m) => ({ cash: '💵', card: '💳', pix: '📱' }[m] || '❓'),
            showNotification: (message, type) => {
                App.DOM.notification.textContent = message;
                App.DOM.notification.className = `notification ${type} show`;
                setTimeout(() => App.DOM.notification.classList.remove('show'), 3000);
            },
            showReceiptModal: (sale) => {
                const { receiptContent, receiptModal } = App.DOM;
                let text = `        ** Açaí da Serra **\n--------------------------------\nData: ${sale.date}\n\n`;
                
                const fee = (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega') ? sale.deliveryInfo.fee : 0;
                
                if (sale.deliveryInfo && sale.deliveryInfo.mode === 'entrega') {
                    text += `         *** ENTREGA ***\n`;
                    if(sale.deliveryInfo.name) text += `Cliente: ${sale.deliveryInfo.name}\n`;
                    if(sale.deliveryInfo.address) text += `Endereço: ${sale.deliveryInfo.address}\n`;
                    text += `--------------------------------\n`;
                }
                
                text += `Itens:\n`;
                sale.items.forEach(item => {
                    let priceLine = `R$ ${item.totalPrice.toFixed(2).padStart(7)}`;
                    if (item.originalPrice) {
                        text += `${item.name.padEnd(20)} (De R$ ${item.originalPrice.toFixed(2)})\n`;
                        text += `  ${`Com desconto:`.padEnd(18)}${priceLine}\n`;
                    } else {
                        text += `${item.name.padEnd(20)}${priceLine}\n`;
                    }
                    
                    if (item.type === 'weight') text += `  (${item.weightGrams}g)\n`;
                });
                
                if (fee > 0) {
                    text += `Taxa Entrega:`.padEnd(20) + `R$ ${fee.toFixed(2).padStart(7)}\n`;
                }
                
                text += `--------------------------------\nTOTAL:`.padEnd(22) + `R$ ${sale.total.toFixed(2).padStart(7)}\n`;
                text += `Pagamento: ${App.utils.getPaymentMethodName(sale.paymentMethod)}\n`;
                if (sale.paymentMethod === 'cash') text += `Recebido: R$ ${sale.cashReceived.toFixed(2)}\nTroco: R$ ${sale.change.toFixed(2)}\n`;
                text += `\n     Obrigado pela preferência!`;
                text += `\n            Volte Sempre!`;
                receiptContent.textContent = text;
                receiptModal.style.display = 'flex';
            },
        },

        storage: {
            load() {
                const salesHistory = localStorage.getItem('salesHistory');
                const expenses = localStorage.getItem('expenses'); 
                const products = localStorage.getItem('products');
                const acaiPrice = localStorage.getItem('açaíPricePerKg');
                const sorvetePrice = localStorage.getItem('sorvetePricePerKg'); 
                const deletePassword = localStorage.getItem('deletePassword');
                const openOrders = localStorage.getItem('openOrders'); 
                
                if(salesHistory) App.state.salesHistory = JSON.parse(salesHistory);
                if(expenses) App.state.expenses = JSON.parse(expenses); 
                if(products) App.state.products = JSON.parse(products);
                if(acaiPrice) App.state.config.açaíPricePerKg = parseFloat(acaiPrice);
                if(sorvetePrice) App.state.config.sorvetePricePerKg = parseFloat(sorvetePrice);
                if(deletePassword) App.state.config.deletePassword = deletePassword;
                if(openOrders) App.state.openOrders = JSON.parse(openOrders); 
            },
            saveSalesHistory() {
                localStorage.setItem('salesHistory', JSON.stringify(App.state.salesHistory));
            },
            saveExpenses() {
                localStorage.setItem('expenses', JSON.stringify(App.state.expenses));
            },
            saveConfig() {
                localStorage.setItem('açaíPricePerKg', App.state.config.açaíPricePerKg);
                localStorage.setItem('sorvetePricePerKg', App.state.config.sorvetePricePerKg);
                localStorage.setItem('deletePassword', App.state.config.deletePassword);
            },
             saveProducts() {
                 localStorage.setItem('products', JSON.stringify(App.state.products));
            },
            saveOpenOrders() { 
                localStorage.setItem('openOrders', JSON.stringify(App.state.openOrders));
            }
        }
    };

    App.init();
});
