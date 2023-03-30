import { Fragment } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DropdownMenuIcon, DotFilledIcon } from '@radix-ui/react-icons';

interface SystemData {
	name: string;
	cores: CoreData[];
}

interface CoreData {
	name: string;
	path: string;
}

const systems: SystemData[] = [
	{
		name: 'Nintendo (NES)',
		cores: [
			{
				name: 'Nestopia',
				path: '/retroarch/cores/nestopia_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Super Nintendo (SNES)',
		cores: [
			{
				name: 'Snes9x',
				path: '/retroarch/cores/snes9x_libretro_libnx.nro',
			},
			//{
			//	name: 'Snes9x (2010)',
			//	path: '/retroarch/cores/snes9x2010_libretro_libnx.nro',
			//},
			{
				name: 'BSNES',
				path: '/retroarch/cores/bsnes_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Nintendo 64 (N64)',
		cores: [
			{
				name: 'Mupen64Plus',
				path: '/retroarch/cores/mupen64plus_next_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Game Boy (GB / GBC)',
		cores: [
			{
				name: 'Gambatte',
				path: '/retroarch/cores/gambatte_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Game Boy Advance (GBA)',
		cores: [
			{
				name: 'mGBA',
				path: '/retroarch/cores/mgba_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Genesis (GEN)',
		cores: [
			{
				name: 'PicoDrive',
				path: '/retroarch/cores/picodrive_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Playstation (PSX)',
		cores: [
			{
				name: 'PCSX ReARMed',
				path: '/retroarch/cores/pcsx_rearmed_libretro_libnx.nro',
			},
		],
	},
	{
		name: 'Playstation Portable (PSP)',
		cores: [
			{
				name: 'PPSSPP (Standalone, GL)',
				path: '/switch/PPSSPP_GL.nro',
			},
			{
				name: 'PPSSPP (Standalone, GLES2)',
				path: '/switch/ppsspp/PPSSPP_GLES2.nro',
			},
			//{
			//	name: 'PPSSPP (RetroArch)',
			//	path: '/retroarch/cores/ppsspp_libretro_libnx.nro',
			//},
		],
	},
];

export interface PresetsDropdownProps {
	value: string;
	onSelect: (v: string) => void;
}

export const PresetsDropdown = ({ value, onSelect }: PresetsDropdownProps) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className="IconButton" title="Presets" tabIndex={-1}>
					<DropdownMenuIcon />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="DropdownMenuContent"
					sideOffset={5}
				>
					<DropdownMenu.RadioGroup
						value={value}
						onValueChange={onSelect}
					>
						{systems.map((system, i) => (
							<Fragment key={system.name}>
								<DropdownMenu.Label className="DropdownMenuLabel">
									{system.name}
								</DropdownMenu.Label>
								{system.cores.map((core) => (
									<DropdownMenu.RadioItem
										className="DropdownMenuRadioItem"
										value={core.path}
										key={core.path}
									>
										<DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
											<DotFilledIcon />
										</DropdownMenu.ItemIndicator>
										{core.name}
									</DropdownMenu.RadioItem>
								))}
								{i < systems.length - 1 ? (
									<DropdownMenu.Separator className="DropdownMenuSeparator" />
								) : null}
							</Fragment>
						))}
					</DropdownMenu.RadioGroup>

					<DropdownMenu.Arrow className="DropdownMenuArrow" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
