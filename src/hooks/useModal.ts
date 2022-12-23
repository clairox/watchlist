import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type UseModalOptions = {
	isOpen?: boolean;
};

export const useModal = ({ isOpen: defaultIsOpen = false }: UseModalOptions = {}) => {
	const [isOpen, setIsOpen] = useState(defaultIsOpen);

	const open = useRef(isOpen);

	const setOpen = useCallback((value: boolean) => {
		open.current = value;
		setIsOpen(value);
	}, []);

	const createModal = () => {
		const modal = document.createElement('div');

		return modal;
	};

	const modal = useRef(
		typeof document !== 'undefined' ? createModal() : null
	) as MutableRefObject<HTMLElement>;

	useEffect(() => {
		if (!modal.current) {
			modal.current = createModal();
		}
	}, [modal]);

	const elToBindTo = useMemo(() => typeof document !== 'undefined' && document.body, []);

	const openModal = useCallback(() => {
		setOpen(true);
		modal.current.id = 'modal';
	}, [setOpen]);

	const closeModal = useCallback(() => {
		if (open.current) {
			setOpen(false);
			modal.current.id = '';
		}
	}, [setOpen]);

	const handleOutsideMouseClick = useCallback(
		(event: MouseEvent) => {
			if (modal.current !== event.target || !open.current) {
				return;
			}

			closeModal();
		},
		[closeModal]
	);

	const handleMouseDown = useCallback(
		(event: MouseEvent) => {
			if (!(modal.current instanceof HTMLElement)) {
				return;
			}

			handleOutsideMouseClick(event);
		},
		[handleOutsideMouseClick]
	);

	useEffect(() => {
		if (!(elToBindTo instanceof HTMLElement) || !(modal.current instanceof HTMLElement)) {
			return;
		}

		const node = modal.current;
		elToBindTo.appendChild(modal.current);

		document.addEventListener('mousedown', handleMouseDown);

		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			elToBindTo.removeChild(node);
		};
	}, [handleMouseDown, handleOutsideMouseClick, elToBindTo]);

	const Modal = useCallback(
		({ children }: { children: React.ReactNode }) => {
			if (modal.current !== null) {
				return createPortal(children, modal.current);
			}

			return null;
		},
		[modal]
	);

	return {
		isOpen: open.current,
		openModal,
		closeModal,
		Modal,
	};
};
