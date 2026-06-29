export interface District {
  value: string;
  label: string;
}

export interface City {
  value: string;
  label: string;
  districts: District[];
}

export interface Province {
  value: string;
  label: string;
  cities: City[];
}

/**
 * Look up the display labels for stored region values.
 * Returns an object with province, city, and district labels.
 */
export function getRegionLabels(
  provinceValue: string,
  cityValue: string,
  districtValue: string
): { provinceLabel: string; cityLabel: string; districtLabel: string } | null {
  const province = REGIONS.find((p) => p.value === provinceValue);
  if (!province) return null;
  const city = province.cities.find((c) => c.value === cityValue);
  if (!city) return null;
  const district = city.districts.find((d) => d.value === districtValue);
  if (!district) return null;
  return {
    provinceLabel: province.label,
    cityLabel: city.label,
    districtLabel: district.label,
  };
}

/**
 * Format a full address string from region values and detail.
 */
export function formatAddress(
  provinceValue: string,
  cityValue: string,
  districtValue: string,
  detail: string
): string {
  const labels = getRegionLabels(provinceValue, cityValue, districtValue);
  if (!labels) return detail;
  return `${labels.provinceLabel} ${labels.cityLabel} ${labels.districtLabel} ${detail}`;
}

export const REGIONS: Province[] = [
  {
    value: 'beijing', label: '北京市',
    cities: [{
      value: 'beijing', label: '北京市',
      districts: [
        { value: 'dongcheng', label: '东城区' },
        { value: 'xicheng', label: '西城区' },
        { value: 'chaoyang', label: '朝阳区' },
        { value: 'fengtai', label: '丰台区' },
        { value: 'shijingshan', label: '石景山区' },
        { value: 'haidian', label: '海淀区' },
        { value: 'tongzhou', label: '通州区' },
        { value: 'daxing', label: '大兴区' },
        { value: 'shunyi', label: '顺义区' },
        { value: 'changping', label: '昌平区' },
      ]
    }]
  },
  {
    value: 'shanghai', label: '上海市',
    cities: [{
      value: 'shanghai', label: '上海市',
      districts: [
        { value: 'huangpu', label: '黄浦区' },
        { value: 'xuhui', label: '徐汇区' },
        { value: 'changning', label: '长宁区' },
        { value: 'jingan', label: '静安区' },
        { value: 'putuo', label: '普陀区' },
        { value: 'hongkou', label: '虹口区' },
        { value: 'yangpu', label: '杨浦区' },
        { value: 'minhang', label: '闵行区' },
        { value: 'baoshan', label: '宝山区' },
        { value: 'jiading', label: '嘉定区' },
        { value: 'pudong', label: '浦东新区' },
        { value: 'songjiang', label: '松江区' },
        { value: 'fengxian', label: '奉贤区' },
        { value: 'qingpu', label: '青浦区' },
      ]
    }]
  },
  {
    value: 'tianjin', label: '天津市',
    cities: [{
      value: 'tianjin', label: '天津市',
      districts: [
        { value: 'heping', label: '和平区' },
        { value: 'hedong', label: '河东区' },
        { value: 'hexi', label: '河西区' },
        { value: 'nankai', label: '南开区' },
        { value: 'hebei', label: '河北区' },
        { value: 'hongqiao', label: '红桥区' },
        { value: 'binhai', label: '滨海新区' },
        { value: 'dongli', label: '东丽区' },
        { value: 'xiqing', label: '西青区' },
        { value: 'beichen', label: '北辰区' },
      ]
    }]
  },
  {
    value: 'chongqing', label: '重庆市',
    cities: [{
      value: 'chongqing', label: '重庆市',
      districts: [
        { value: 'yuzhong', label: '渝中区' },
        { value: 'jiangbei', label: '江北区' },
        { value: 'nanan', label: '南岸区' },
        { value: 'jiulongpo', label: '九龙坡区' },
        { value: 'shapingba', label: '沙坪坝区' },
        { value: 'dadukou', label: '大渡口区' },
        { value: 'beibei', label: '北碚区' },
        { value: 'yubei', label: '渝北区' },
        { value: 'banan', label: '巴南区' },
      ]
    }]
  },
  {
    value: 'guangdong', label: '广东省',
    cities: [
      {
        value: 'guangzhou', label: '广州市',
        districts: [
          { value: 'yuexiu', label: '越秀区' },
          { value: 'tianhe', label: '天河区' },
          { value: 'haizhu', label: '海珠区' },
          { value: 'baiyun', label: '白云区' },
          { value: 'liwan', label: '荔湾区' },
          { value: 'huangpu_gz', label: '黄埔区' },
        ]
      },
      {
        value: 'shenzhen', label: '深圳市',
        districts: [
          { value: 'futian', label: '福田区' },
          { value: 'nanshan', label: '南山区' },
          { value: 'luohu', label: '罗湖区' },
          { value: 'baoan', label: '宝安区' },
          { value: 'longgang', label: '龙岗区' },
          { value: 'longhua', label: '龙华区' },
        ]
      },
      {
        value: 'dongguan', label: '东莞市',
        districts: [
          { value: 'guancheng', label: '莞城街道' },
          { value: 'nancheng', label: '南城街道' },
          { value: 'dongcheng_dg', label: '东城街道' },
          { value: 'wanjiang', label: '万江街道' },
          { value: 'changan', label: '长安镇' },
          { value: 'humen', label: '虎门镇' },
        ]
      },
      {
        value: 'foshan', label: '佛山市',
        districts: [
          { value: 'chancheng', label: '禅城区' },
          { value: 'nanhai', label: '南海区' },
          { value: 'shunde', label: '顺德区' },
          { value: 'sanshui', label: '三水区' },
          { value: 'gaoming', label: '高明区' },
        ]
      },
      {
        value: 'zhuhai', label: '珠海市',
        districts: [
          { value: 'xiangzhou', label: '香洲区' },
          { value: 'doumen', label: '斗门区' },
          { value: 'jinwan', label: '金湾区' },
        ]
      },
      {
        value: 'zhongshan', label: '中山市',
        districts: [
          { value: 'dongqu', label: '东区街道' },
          { value: 'nanqu', label: '南区街道' },
          { value: 'xiqu', label: '西区街道' },
          { value: 'shiqiqu', label: '石岐街道' },
        ]
      },
      {
        value: 'huizhou', label: '惠州市',
        districts: [
          { value: 'huicheng', label: '惠城区' },
          { value: 'huiyang', label: '惠阳区' },
          { value: 'boluo', label: '博罗县' },
          { value: 'huidong', label: '惠东县' },
        ]
      },
    ]
  },
  {
    value: 'zhejiang', label: '浙江省',
    cities: [
      {
        value: 'hangzhou', label: '杭州市',
        districts: [
          { value: 'shangcheng', label: '上城区' },
          { value: 'gongshu', label: '拱墅区' },
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
          { value: 'xiaoshan', label: '萧山区' },
          { value: 'yuhang', label: '余杭区' },
        ]
      },
      {
        value: 'ningbo', label: '宁波市',
        districts: [
          { value: 'haishu', label: '海曙区' },
          { value: 'yinzhou', label: '鄞州区' },
          { value: 'jiangbei_nb', label: '江北区' },
          { value: 'beilun', label: '北仑区' },
          { value: 'zhenhai', label: '镇海区' },
        ]
      },
      {
        value: 'wenzhou', label: '温州市',
        districts: [
          { value: 'lucheng', label: '鹿城区' },
          { value: 'longwan', label: '龙湾区' },
          { value: 'ouhai', label: '瓯海区' },
          { value: 'dongtou', label: '洞头区' },
        ]
      },
      {
        value: 'jiaxing', label: '嘉兴市',
        districts: [
          { value: 'nanhu', label: '南湖区' },
          { value: 'xiuzhou', label: '秀洲区' },
          { value: 'haining', label: '海宁市' },
          { value: 'tongxiang', label: '桐乡市' },
        ]
      },
      {
        value: 'huzhou', label: '湖州市',
        districts: [
          { value: 'wuxing', label: '吴兴区' },
          { value: 'nanxun', label: '南浔区' },
          { value: 'deqing', label: '德清县' },
          { value: 'changxing', label: '长兴县' },
        ]
      },
      {
        value: 'shaoxing', label: '绍兴市',
        districts: [
          { value: 'yuecheng', label: '越城区' },
          { value: 'keqiao', label: '柯桥区' },
          { value: 'shangyu', label: '上虞区' },
          { value: 'zhuji', label: '诸暨市' },
        ]
      },
      {
        value: 'jinhua', label: '金华市',
        districts: [
          { value: 'wucheng', label: '婺城区' },
          { value: 'jindong', label: '金东区' },
          { value: 'yiwu', label: '义乌市' },
          { value: 'dongyang', label: '东阳市' },
        ]
      },
    ]
  },
  {
    value: 'jiangsu', label: '江苏省',
    cities: [
      {
        value: 'nanjing', label: '南京市',
        districts: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'qinhuai', label: '秦淮区' },
          { value: 'jianye', label: '建邺区' },
          { value: 'gulou', label: '鼓楼区' },
          { value: 'pukou', label: '浦口区' },
          { value: 'jiangning', label: '江宁区' },
        ]
      },
      {
        value: 'suzhou', label: '苏州市',
        districts: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'huqiu', label: '虎丘区' },
          { value: 'wuzhong', label: '吴中区' },
          { value: 'xiangcheng', label: '相城区' },
          { value: 'wujiang', label: '吴江区' },
        ]
      },
      {
        value: 'wuxi', label: '无锡市',
        districts: [
          { value: 'liangxi', label: '梁溪区' },
          { value: 'xishan', label: '锡山区' },
          { value: 'huishan', label: '惠山区' },
          { value: 'binhu', label: '滨湖区' },
          { value: 'xinwu', label: '新吴区' },
        ]
      },
      {
        value: 'changzhou', label: '常州市',
        districts: [
          { value: 'tianning', label: '天宁区' },
          { value: 'zhonglou', label: '钟楼区' },
          { value: 'xinbei', label: '新北区' },
          { value: 'wujin', label: '武进区' },
        ]
      },
      {
        value: 'nantong', label: '南通市',
        districts: [
          { value: 'chongchuan', label: '崇川区' },
          { value: 'tongzhou_nt', label: '通州区' },
          { value: 'haimen', label: '海门区' },
        ]
      },
      {
        value: 'xuzhou', label: '徐州市',
        districts: [
          { value: 'yunlong', label: '云龙区' },
          { value: 'quanshan', label: '泉山区' },
          { value: 'gulou_xz', label: '鼓楼区' },
          { value: 'tongshan', label: '铜山区' },
        ]
      },
      {
        value: 'yangzhou', label: '扬州市',
        districts: [
          { value: 'guangling', label: '广陵区' },
          { value: 'hanjiang', label: '邗江区' },
          { value: 'jiangdu', label: '江都区' },
        ]
      },
    ]
  },
  {
    value: 'sichuan', label: '四川省',
    cities: [
      {
        value: 'chengdu', label: '成都市',
        districts: [
          { value: 'jinjiang', label: '锦江区' },
          { value: 'qingyang', label: '青羊区' },
          { value: 'jinniu', label: '金牛区' },
          { value: 'wuhou', label: '武侯区' },
          { value: 'chenghua', label: '成华区' },
        ]
      },
      {
        value: 'guangan', label: '广安市',
        districts: [
          { value: 'guanganqu', label: '广安区' },
          { value: 'qianfeng', label: '前锋区' },
          { value: 'yuechi', label: '岳池县' },
          { value: 'wusheng', label: '武胜县' },
          { value: 'linshui', label: '邻水县' },
        ]
      },
      {
        value: 'mianyang', label: '绵阳市',
        districts: [
          { value: 'fucheng', label: '涪城区' },
          { value: 'youxian', label: '游仙区' },
          { value: 'anzhou', label: '安州区' },
        ]
      },
      {
        value: 'deyang', label: '德阳市',
        districts: [
          { value: 'jingyang', label: '旌阳区' },
          { value: 'luojiang', label: '罗江区' },
          { value: 'guanghan', label: '广汉市' },
        ]
      },
      {
        value: 'yibin', label: '宜宾市',
        districts: [
          { value: 'cuiping', label: '翠屏区' },
          { value: 'nanxi', label: '南溪区' },
          { value: 'xuzhou_yb', label: '叙州区' },
        ]
      },
    ]
  },
  {
    value: 'hubei', label: '湖北省',
    cities: [
      {
        value: 'wuhan', label: '武汉市',
        districts: [
          { value: 'jiangan', label: '江岸区' },
          { value: 'jianghan', label: '江汉区' },
          { value: 'qiaokou', label: '硚口区' },
          { value: 'hanyang', label: '汉阳区' },
          { value: 'wuchang', label: '武昌区' },
          { value: 'hongshan', label: '洪山区' },
        ]
      },
      {
        value: 'yichang', label: '宜昌市',
        districts: [
          { value: 'xiling', label: '西陵区' },
          { value: 'wujiagang', label: '伍家岗区' },
          { value: 'dianjun', label: '点军区' },
          { value: 'xiaoting', label: '猇亭区' },
        ]
      },
      {
        value: 'xiangyang', label: '襄阳市',
        districts: [
          { value: 'xiangcheng_xy', label: '襄城区' },
          { value: 'fancheng', label: '樊城区' },
          { value: 'xiangzhou', label: '襄州区' },
        ]
      },
    ]
  },
  {
    value: 'hunan', label: '湖南省',
    cities: [
      {
        value: 'changsha', label: '长沙市',
        districts: [
          { value: 'furong', label: '芙蓉区' },
          { value: 'tianxin', label: '天心区' },
          { value: 'yuelu', label: '岳麓区' },
          { value: 'kaifu', label: '开福区' },
          { value: 'yuhua', label: '雨花区' },
        ]
      },
      {
        value: 'zhuzhou', label: '株洲市',
        districts: [
          { value: 'hetang', label: '荷塘区' },
          { value: 'lusong', label: '芦淞区' },
          { value: 'shifeng', label: '石峰区' },
          { value: 'tianyuan', label: '天元区' },
        ]
      },
      {
        value: 'xiangtan', label: '湘潭市',
        districts: [
          { value: 'yuhu', label: '雨湖区' },
          { value: 'yuetang', label: '岳塘区' },
          { value: 'xiangxiang', label: '湘乡市' },
        ]
      },
    ]
  },
  {
    value: 'shandong', label: '山东省',
    cities: [
      {
        value: 'jinan', label: '济南市',
        districts: [
          { value: 'lixia', label: '历下区' },
          { value: 'shizhong', label: '市中区' },
          { value: 'huaiyin', label: '槐荫区' },
          { value: 'tianqiao', label: '天桥区' },
          { value: 'licheng', label: '历城区' },
        ]
      },
      {
        value: 'qingdao', label: '青岛市',
        districts: [
          { value: 'shinan', label: '市南区' },
          { value: 'shibei', label: '市北区' },
          { value: 'huangdao', label: '黄岛区' },
          { value: 'laoshan', label: '崂山区' },
          { value: 'licang', label: '李沧区' },
          { value: 'chengyang', label: '城阳区' },
        ]
      },
      {
        value: 'yantai', label: '烟台市',
        districts: [
          { value: 'zhifu', label: '芝罘区' },
          { value: 'fushan', label: '福山区' },
          { value: 'muping', label: '牟平区' },
          { value: 'laishan', label: '莱山区' },
        ]
      },
      {
        value: 'weihai', label: '威海市',
        districts: [
          { value: 'huancui', label: '环翠区' },
          { value: 'wendeng', label: '文登区' },
          { value: 'rongcheng', label: '荣成市' },
        ]
      },
      {
        value: 'weifang', label: '潍坊市',
        districts: [
          { value: 'weicheng', label: '潍城区' },
          { value: 'hanting', label: '寒亭区' },
          { value: 'fangzi', label: '坊子区' },
          { value: 'kuiwen', label: '奎文区' },
        ]
      },
    ]
  },
  {
    value: 'fujian', label: '福建省',
    cities: [
      {
        value: 'fuzhou', label: '福州市',
        districts: [
          { value: 'gulou_fz', label: '鼓楼区' },
          { value: 'taijiang', label: '台江区' },
          { value: 'cangshan', label: '仓山区' },
          { value: 'mawei', label: '马尾区' },
          { value: 'jinan_fz', label: '晋安区' },
        ]
      },
      {
        value: 'xiamen', label: '厦门市',
        districts: [
          { value: 'siming', label: '思明区' },
          { value: 'huli', label: '湖里区' },
          { value: 'jimei', label: '集美区' },
          { value: 'haicang', label: '海沧区' },
          { value: 'tongan', label: '同安区' },
        ]
      },
      {
        value: 'quanzhou', label: '泉州市',
        districts: [
          { value: 'licheng_qz', label: '鲤城区' },
          { value: 'fengze', label: '丰泽区' },
          { value: 'luojiang', label: '洛江区' },
          { value: 'quangang', label: '泉港区' },
        ]
      },
      {
        value: 'zhangzhou', label: '漳州市',
        districts: [
          { value: 'xiangcheng_zz', label: '芗城区' },
          { value: 'longwen', label: '龙文区' },
          { value: 'longhai', label: '龙海区' },
        ]
      },
    ]
  },
  {
    value: 'henan', label: '河南省',
    cities: [
      {
        value: 'zhengzhou', label: '郑州市',
        districts: [
          { value: 'jinshui', label: '金水区' },
          { value: 'erqi', label: '二七区' },
          { value: 'zhongyuan', label: '中原区' },
          { value: 'guancheng_zz', label: '管城回族区' },
          { value: 'huiji', label: '惠济区' },
        ]
      },
      {
        value: 'luoyang', label: '洛阳市',
        districts: [
          { value: 'xigong', label: '西工区' },
          { value: 'laocheng', label: '老城区' },
          { value: 'chanhe', label: '瀍河回族区' },
          { value: 'jianxi', label: '涧西区' },
          { value: 'luolong', label: '洛龙区' },
        ]
      },
      {
        value: 'kaifeng', label: '开封市',
        districts: [
          { value: 'gulou_kf', label: '鼓楼区' },
          { value: 'longting', label: '龙亭区' },
          { value: 'yuwangtai', label: '禹王台区' },
          { value: 'shunhe', label: '顺河回族区' },
        ]
      },
    ]
  },
  {
    value: 'hebei', label: '河北省',
    cities: [
      {
        value: 'shijiazhuang', label: '石家庄市',
        districts: [
          { value: 'changan_sjz', label: '长安区' },
          { value: 'qiaoxi', label: '桥西区' },
          { value: 'xinhua', label: '新华区' },
          { value: 'yuhua_sjz', label: '裕华区' },
        ]
      },
      {
        value: 'tangshan', label: '唐山市',
        districts: [
          { value: 'lubei', label: '路北区' },
          { value: 'lunan', label: '路南区' },
          { value: 'fengrun', label: '丰润区' },
          { value: 'fengnan', label: '丰南区' },
        ]
      },
      {
        value: 'baoding', label: '保定市',
        districts: [
          { value: 'jingxiu', label: '竞秀区' },
          { value: 'lianchi', label: '莲池区' },
          { value: 'mancheng', label: '满城区' },
          { value: 'qingyuan', label: '清苑区' },
        ]
      },
      {
        value: 'langfang', label: '廊坊市',
        districts: [
          { value: 'anci', label: '安次区' },
          { value: 'guangyang', label: '广阳区' },
          { value: 'sanhe', label: '三河市' },
        ]
      },
    ]
  },
  {
    value: 'shaanxi', label: '陕西省',
    cities: [
      {
        value: 'xian', label: '西安市',
        districts: [
          { value: 'weiyang', label: '未央区' },
          { value: 'yanta', label: '雁塔区' },
          { value: 'beilin', label: '碑林区' },
          { value: 'lianhu', label: '莲湖区' },
          { value: 'xincheng', label: '新城区' },
        ]
      },
      {
        value: 'xianyang', label: '咸阳市',
        districts: [
          { value: 'qindu', label: '秦都区' },
          { value: 'weicheng_xy', label: '渭城区' },
          { value: 'yangling', label: '杨陵区' },
        ]
      },
    ]
  },
  {
    value: 'anhui', label: '安徽省',
    cities: [
      {
        value: 'hefei', label: '合肥市',
        districts: [
          { value: 'shushan', label: '蜀山区' },
          { value: 'baohe', label: '包河区' },
          { value: 'luyang', label: '庐阳区' },
          { value: 'yaohai', label: '瑶海区' },
        ]
      },
      {
        value: 'wuhu', label: '芜湖市',
        districts: [
          { value: 'jinghu', label: '镜湖区' },
          { value: 'yijiang', label: '弋江区' },
          { value: 'jiujiang_wh', label: '鸠江区' },
          { value: 'wanzhi', label: '湾沚区' },
        ]
      },
    ]
  },
  {
    value: 'liaoning', label: '辽宁省',
    cities: [
      {
        value: 'shenyang', label: '沈阳市',
        districts: [
          { value: 'shenhe', label: '沈河区' },
          { value: 'heping_sy', label: '和平区' },
          { value: 'dadong', label: '大东区' },
          { value: 'huanggu', label: '皇姑区' },
          { value: 'tiexi', label: '铁西区' },
        ]
      },
      {
        value: 'dalian', label: '大连市',
        districts: [
          { value: 'zhongshan', label: '中山区' },
          { value: 'xigang', label: '西岗区' },
          { value: 'shahekou', label: '沙河口区' },
          { value: 'ganjingzi', label: '甘井子区' },
        ]
      },
    ]
  },
  {
    value: 'jilin', label: '吉林省',
    cities: [
      {
        value: 'changchun', label: '长春市',
        districts: [
          { value: 'nanguan', label: '南关区' },
          { value: 'kuancheng', label: '宽城区' },
          { value: 'chaoyang_cc', label: '朝阳区' },
          { value: 'erdao', label: '二道区' },
          { value: 'lvyuan', label: '绿园区' },
        ]
      },
      {
        value: 'jilin_city', label: '吉林市',
        districts: [
          { value: 'chuanying', label: '船营区' },
          { value: 'changyi', label: '昌邑区' },
          { value: 'longtan', label: '龙潭区' },
          { value: 'fengman', label: '丰满区' },
        ]
      },
    ]
  },
  {
    value: 'heilongjiang', label: '黑龙江省',
    cities: [
      {
        value: 'haerbin', label: '哈尔滨市',
        districts: [
          { value: 'daoli', label: '道里区' },
          { value: 'nangang', label: '南岗区' },
          { value: 'daowai', label: '道外区' },
          { value: 'xiangfang', label: '香坊区' },
          { value: 'songbei', label: '松北区' },
        ]
      },
      {
        value: 'daqing', label: '大庆市',
        districts: [
          { value: 'saertu', label: '萨尔图区' },
          { value: 'longfeng', label: '龙凤区' },
          { value: 'ranghulu', label: '让胡路区' },
          { value: 'honggang', label: '红岗区' },
        ]
      },
    ]
  },
  {
    value: 'jiangxi', label: '江西省',
    cities: [
      {
        value: 'nanchang', label: '南昌市',
        districts: [
          { value: 'donghu', label: '东湖区' },
          { value: 'xihu_nc', label: '西湖区' },
          { value: 'qingyunpu', label: '青云谱区' },
          { value: 'qingshanhu', label: '青山湖区' },
          { value: 'xinjian', label: '新建区' },
        ]
      },
      {
        value: 'jiujiang', label: '九江市',
        districts: [
          { value: 'xunyang', label: '浔阳区' },
          { value: 'lianxi', label: '濂溪区' },
          { value: 'chaisang', label: '柴桑区' },
        ]
      },
    ]
  },
  {
    value: 'yunnan', label: '云南省',
    cities: [
      {
        value: 'kunming', label: '昆明市',
        districts: [
          { value: 'wuhua', label: '五华区' },
          { value: 'panlong', label: '盘龙区' },
          { value: 'guandu', label: '官渡区' },
          { value: 'xishan', label: '西山区' },
          { value: 'chenggong', label: '呈贡区' },
        ]
      },
      {
        value: 'dali', label: '大理白族自治州',
        districts: [
          { value: 'dali_city', label: '大理市' },
          { value: 'xiangyun', label: '祥云县' },
          { value: 'binchuan', label: '宾川县' },
          { value: 'midu', label: '弥渡县' },
        ]
      },
    ]
  },
  {
    value: 'guizhou', label: '贵州省',
    cities: [
      {
        value: 'guiyang', label: '贵阳市',
        districts: [
          { value: 'nanming', label: '南明区' },
          { value: 'yunyan', label: '云岩区' },
          { value: 'huaxi', label: '花溪区' },
          { value: 'wudang', label: '乌当区' },
          { value: 'baiyun_gy', label: '白云区' },
        ]
      },
      {
        value: 'zunyi', label: '遵义市',
        districts: [
          { value: 'honghuagang', label: '红花岗区' },
          { value: 'huichuan', label: '汇川区' },
          { value: 'bozhou', label: '播州区' },
        ]
      },
    ]
  },
  {
    value: 'guangxi', label: '广西壮族自治区',
    cities: [
      {
        value: 'nanning', label: '南宁市',
        districts: [
          { value: 'qingxiu', label: '青秀区' },
          { value: 'xingning', label: '兴宁区' },
          { value: 'xixiangtang', label: '西乡塘区' },
          { value: 'liangqing', label: '良庆区' },
        ]
      },
      {
        value: 'guilin', label: '桂林市',
        districts: [
          { value: 'xiufeng', label: '秀峰区' },
          { value: 'xiangshan', label: '象山区' },
          { value: 'qixing', label: '七星区' },
          { value: 'diecai', label: '叠彩区' },
        ]
      },
      {
        value: 'liuzhou', label: '柳州市',
        districts: [
          { value: 'liubei', label: '柳北区' },
          { value: 'liunan', label: '柳南区' },
          { value: 'yufeng', label: '鱼峰区' },
          { value: 'chengzhong', label: '城中区' },
        ]
      },
    ]
  },
  {
    value: 'hainan', label: '海南省',
    cities: [
      {
        value: 'haikou', label: '海口市',
        districts: [
          { value: 'longhua', label: '龙华区' },
          { value: 'xiuying', label: '秀英区' },
          { value: 'qiongshan', label: '琼山区' },
          { value: 'meilan', label: '美兰区' },
        ]
      },
      {
        value: 'sanya', label: '三亚市',
        districts: [
          { value: 'jiiyang', label: '吉阳区' },
          { value: 'tianya', label: '天涯区' },
          { value: 'haitang', label: '海棠区' },
          { value: 'yazhou', label: '崖州区' },
        ]
      },
    ]
  },
  {
    value: 'shanxi', label: '山西省',
    cities: [
      {
        value: 'taiyuan', label: '太原市',
        districts: [
          { value: 'yingze', label: '迎泽区' },
          { value: 'xinghualing', label: '杏花岭区' },
          { value: 'wanbailin', label: '万柏林区' },
          { value: 'xiaodian', label: '小店区' },
          { value: 'jiancaoping', label: '尖草坪区' },
        ]
      },
      {
        value: 'datong', label: '大同市',
        districts: [
          { value: 'pingcheng', label: '平城区' },
          { value: 'yungang', label: '云冈区' },
          { value: 'xinrong', label: '新荣区' },
          { value: 'yunzhou', label: '云州区' },
        ]
      },
    ]
  },
  {
    value: 'gansu', label: '甘肃省',
    cities: [
      {
        value: 'lanzhou', label: '兰州市',
        districts: [
          { value: 'chengguan', label: '城关区' },
          { value: 'qilihe', label: '七里河区' },
          { value: 'xigu', label: '西固区' },
          { value: 'anning', label: '安宁区' },
        ]
      },
      {
        value: 'tianshui', label: '天水市',
        districts: [
          { value: 'qinzhou', label: '秦州区' },
          { value: 'maiji', label: '麦积区' },
          { value: 'qingshui', label: '清水县' },
        ]
      },
    ]
  },
  {
    value: 'neimenggu', label: '内蒙古自治区',
    cities: [
      {
        value: 'huhehaote', label: '呼和浩特市',
        districts: [
          { value: 'xincheng_nmg', label: '新城区' },
          { value: 'huimin', label: '回民区' },
          { value: 'yuquan', label: '玉泉区' },
          { value: 'saihan', label: '赛罕区' },
        ]
      },
      {
        value: 'baotou', label: '包头市',
        districts: [
          { value: 'kundulun', label: '昆都仑区' },
          { value: 'donghe', label: '东河区' },
          { value: 'qingshan', label: '青山区' },
          { value: 'shiguai', label: '石拐区' },
        ]
      },
    ]
  },
  {
    value: 'xinjiang', label: '新疆维吾尔自治区',
    cities: [
      {
        value: 'wulumuqi', label: '乌鲁木齐市',
        districts: [
          { value: 'tianshan', label: '天山区' },
          { value: 'sayibake', label: '沙依巴克区' },
          { value: 'xinshi', label: '新市区' },
          { value: 'shuimogou', label: '水磨沟区' },
          { value: 'toutunhe', label: '头屯河区' },
        ]
      },
    ]
  },
  {
    value: 'xizang', label: '西藏自治区',
    cities: [
      {
        value: 'lasa', label: '拉萨市',
        districts: [
          { value: 'chengguan_lasa', label: '城关区' },
          { value: 'duilongdeqing', label: '堆龙德庆区' },
          { value: 'dazi', label: '达孜区' },
          { value: 'linzhou', label: '林周县' },
        ]
      },
    ]
  },
  {
    value: 'ningxia', label: '宁夏回族自治区',
    cities: [
      {
        value: 'yinchuan', label: '银川市',
        districts: [
          { value: 'xingqing', label: '兴庆区' },
          { value: 'xixia', label: '西夏区' },
          { value: 'jinfeng', label: '金凤区' },
          { value: 'lingwu', label: '灵武市' },
        ]
      },
    ]
  },
  {
    value: 'qinghai', label: '青海省',
    cities: [
      {
        value: 'xining', label: '西宁市',
        districts: [
          { value: 'chengzhong_qh', label: '城中区' },
          { value: 'chengdong', label: '城东区' },
          { value: 'chengxi', label: '城西区' },
          { value: 'chengbei', label: '城北区' },
        ]
      },
    ]
  },
  {
    value: 'taiwan', label: '台湾省',
    cities: [
      {
        value: 'taibei', label: '台北市',
        districts: [
          { value: 'daan', label: '大安区' },
          { value: 'xinyi', label: '信义区' },
          { value: 'zhongshan_tb', label: '中山区' },
          { value: 'zhongzheng', label: '中正区' },
          { value: 'songshan', label: '松山区' },
        ]
      },
      {
        value: 'gaoxiong', label: '高雄市',
        districts: [
          { value: 'lingya', label: '苓雅区' },
          { value: 'qianzhen', label: '前镇区' },
          { value: 'gushan', label: '鼓山区' },
          { value: 'sanmin', label: '三民区' },
        ]
      },
      {
        value: 'taizhong', label: '台中市',
        districts: [
          { value: 'xitun', label: '西屯区' },
          { value: 'beitun', label: '北屯区' },
          { value: 'nanqu_tz', label: '南区' },
          { value: 'beiqu', label: '北区' },
        ]
      },
    ]
  },
  {
    value: 'hongkong', label: '香港特别行政区',
    cities: [
      {
        value: 'hongkong', label: '香港特别行政区',
        districts: [
          { value: 'zhongxi', label: '中西区' },
          { value: 'dongqu_hk', label: '东区' },
          { value: 'nanqu_hk', label: '南区' },
          { value: 'wanzi', label: '湾仔区' },
          { value: 'jiulongcheng', label: '九龙城区' },
          { value: 'guantang', label: '观塘区' },
          { value: 'shenshuibu', label: '深水埗区' },
          { value: 'huangdaxian', label: '黄大仙区' },
          { value: 'youjianwang', label: '油尖旺区' },
          { value: 'lidao', label: '离岛区' },
          { value: 'kuihuo', label: '葵青区' },
          { value: 'beiqu_hk', label: '北区' },
          { value: 'xigong', label: '西贡区' },
          { value: 'shatian', label: '沙田区' },
          { value: 'dapu', label: '大埔区' },
          { value: 'quanwan', label: '荃湾区' },
          { value: 'tunmen', label: '屯门区' },
          { value: 'yuanlang', label: '元朗区' },
        ]
      },
    ]
  },
  {
    value: 'macao', label: '澳门特别行政区',
    cities: [
      {
        value: 'macao', label: '澳门特别行政区',
        districts: [
          { value: 'aomenbandao', label: '澳门半岛' },
          { value: 'dangzai', label: '氹仔' },
          { value: 'luhuan', label: '路环' },
        ]
      },
    ]
  },
];
