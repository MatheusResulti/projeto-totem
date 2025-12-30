/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";
import { formatToBRL } from "../../../utils/helpers";
import {
  useComplements,
  useOrder,
  useSizes,
  useUserData,
  useCount,
} from "../../../utils/store";
import QuantityCounter from "../../Cart/QuantityCounter/QuantityCounter";
import AditionalItem from "../../Cart/AditionalItem/AditionalItem";
import type { ItemType, ProductType } from "../../../types/types";
import { useTotemColor } from "../../../utils/useTotemColor";

type ProductInfoProps = {
  product: ProductType;
  setModalVisible: (value: boolean) => void;
};

export default function ProductInfo({
  product,
  setModalVisible,
}: ProductInfoProps) {
  const sizes = useSizes((s) => s.sizes);
  const complements = useComplements((s) => s.complements);
  const order = useOrder((s) => s.order);
  const setOrder = useOrder((s) => s.setOrder);
  const userData = useUserData((s: any) => s.userData);
  const { quantity, setQuantity } = useCount();
  const { primary } = useTotemColor();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [obs, setObs] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);

  const maxChars = 200;

  const sizesData = useMemo(
    () =>
      sizes
        .filter((s: any) => s.productId === product.id)
        .map((s: any) => ({ ...s, selected: false })),
    [sizes, product.id]
  );

  const selectSize = (item: any) => {
    setSelectedSize(item);
  };

  const filteredComplements = useMemo(() => {
    const pid = Number(product.id);
    const gid = Number(product.groupId ?? 0);

    return complements
      .filter((c: any) => {
        const targetId = Number(c.groupId ?? 0);
        const type = String(c.groupType ?? "").toLowerCase();
        return (
          (type === "p" && targetId === pid) ||
          (type === "g" && targetId === gid)
        );
      })
      .map((c: any) => ({ ...c, selected: !!c.selected }));
  }, [complements, product.id, product.groupId]);

  const [complementsData, setComplementsData] = useState<any[]>([]);

  useEffect(() => {
    setComplementsData(filteredComplements);
  }, [filteredComplements]);

  const selectComplement = (item: any) => {
    setComplementsData((prev) => {
      const next = [...prev];
      const idx = next.findIndex((c) => c.id === item.id);
      if (idx >= 0) next[idx] = { ...next[idx], selected: !next[idx].selected };
      return next;
    });
  };

  const setOrderItem = () => {
    setLoadingInfo(true);

    if (sizesData.length && !selectedSize) {
      toast.error("Escolha um tamanho para prosseguir");
      setLoadingInfo(false);
      return;
    }

    const selectedComplements = complementsData
      .filter((c) => c.selected)
      .map((c) => ({ adicional_id: c.id, name: c.name }));

    const total = totalPrice * quantity;
    const unit = selectedSize ? selectedSize.price : product.price;

    const newItem: ItemType = {
      dsProduto: product.name,
      tamanho_id: selectedSize ? selectedSize.id : "",
      tamanho_nome: selectedSize ? selectedSize.name : "",
      produto_id: product.id,
      quantidade: quantity,
      price: total,
      valor_unitario: Number(unit.toFixed(2)),
      observacao: obs,
      tpProduto: product.type ?? "",
      adicionais: selectedComplements,
    };

    setOrder({
      ...order,
      itens: [...order.itens, newItem],
      total: Number((order.total + total).toFixed(2)),
      cdUsuario: userData?.cdAtendente,
    });

    setModalVisible(false);
    setLoadingInfo(false);
    toast.success("Item adicionado ao pedido!");
    setQuantity(1);
  };

  const hasSizes = sizesData.length > 0;
  const noBasePrice = !product.price || product.price === 0;
  const shouldDeferPrice = hasSizes && noBasePrice && !selectedSize;
  const hasComplements = complementsData.length > 0;

  const basePrice = shouldDeferPrice
    ? 0
    : (selectedSize?.price ?? product.price);
  const complementPrice = shouldDeferPrice
    ? 0
    : complementsData
        .filter((c: any) => c.selected)
        .reduce((sum, c: any) => sum + c.price, 0);
  const totalPrice = Number((basePrice + complementPrice).toFixed(2));

  return (
    <div className="flex flex-col min-h-[80vh] pb-8">
      <div className="flex flex-row items-center px-5 gap-6 border-b border-b-gray-800 h-60">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-50 h-50 rounded-lg object-fill"
          />
        ) : (
          <div className="flex items-center justify-center w-50 h-50 rounded-lg bg-gray-200">
            <ShoppingBasket className="size-14 text-basket" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-text-color mb-2">
            {product.name}
          </span>
          <span className="text-md font-light">{product.description}</span>
        </div>
      </div>

      <div
        className="px-3 py-2 scrollbar-none flex flex-col gap-1 flex-1 overflow-y-auto pb-20"
        style={{ paddingBottom: keyboardOpen ? 260 : 80 }}
      >
        {hasSizes && (
          <>
            <div className="w-full bg-card-color p-2 rounded-lg flex flex-col">
              <span className="text-sm text-text-color font-bold">
                Qual o tamanho da sua fome?
              </span>
              <span className="text-sm text-text-color">
                Escolha 1 tamanho.
              </span>
            </div>
            {sizesData.map((item: any, i: number) => (
              <AditionalItem
                i={i}
                item={item}
                key={item.id}
                selected={selectedSize?.id === item.id}
                action={selectSize}
              />
            ))}
          </>
        )}

        {hasComplements && (
          <>
            <div className="w-full bg-card-color p-2 rounded-lg flex flex-col">
              <span className="text-sm text-text-color font-bold">
                Turbine seu pedido!
              </span>
              <span className="text-sm text-text-color">
                Escolha até {complementsData.length} opções
              </span>
            </div>
            {complementsData.map((item: any, i: number) => (
              <AditionalItem
                i={i}
                item={item}
                key={item.id}
                action={selectComplement}
                selected={!!item.selected}
              />
            ))}
          </>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between px-1">
            <span className="text-sm text-gray-600/70 font-semibold">
              Observação
            </span>
            <span
              className={`text-sm ${
                obs.length >= maxChars ? "text-error" : "text-gray-600/70"
              }`}
            >
              {obs.length}/{maxChars}
            </span>
          </div>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value.slice(0, maxChars))}
            onFocus={() => setKeyboardOpen(true)}
            onBlur={() => setKeyboardOpen(false)}
            maxLength={maxChars}
            placeholder="Ex: remover alface e tomate"
            className="border border-gray-300 rounded-lg pl-2 pt-2.5 text-text-color w-full resize-none overflow-hidden h-12"
            data-enter-action="close-keyboard"
          />
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 flex justify-between items-center h-20 p-4">
        <QuantityCounter />
        <button
          disabled={loadingInfo || (hasSizes && !selectedSize)}
          style={{ backgroundColor: primary }}
          className="cart-text touchable items-center justify-between rounded-lg h-full w-1/2 flex px-4 disabled:opacity-50"
          onClick={setOrderItem}
        >
          {loadingInfo ? "Adicionando..." : "Adicionar"}
          <span>
            {shouldDeferPrice ? "R$ --" : formatToBRL(totalPrice * quantity)}
          </span>
        </button>
      </div>
    </div>
  );
}
